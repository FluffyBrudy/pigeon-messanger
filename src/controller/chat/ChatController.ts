import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { BodyValidationError, LoggerApiError } from "../../error/error";
import { ExpressUser, TCursor } from "../../types/common";
import { dbClient } from "../../service/dbClient";
import { CURSOR } from "../../validator/social/constants";
import { LIMIT } from "./constants";
import { FRIENDS_IDS, RECIPIENT_ID } from "../../validator/chat/constants";

interface MessageReqBody {
  [RECIPIENT_ID]: string;
  message: string;
}

export const CreateChatMessageController: RequestHandler = async (
  req,
  res,
  next
) => {
  const validatedRes = validationResult(req);
  if (!validatedRes.isEmpty()) {
    return next(new BodyValidationError(validatedRes.array()));
  }

  const creatorId = (req.user as ExpressUser).id;
  const { recipientId, message } = req.body as MessageReqBody;

  try {
    const messageItem = await dbClient.message.create({
      data: {
        creatorId,
        messageBody: message,
        messageRecipient: {
          create: { recipientId, isRead: false }, //id auto-connected
        },
      },
      select: {
        id: true,
        creatorId: true,
        messageBody: true,
        messageRecipient: { select: { recipientId: true } },
        isFile: true,
      },
    });
    const flattenResponse = {
      creatorId: messageItem.creatorId,
      id: messageItem.id,
      message: messageItem.messageBody,
      isFile: messageItem.isFile,
    };
    res.json({ data: flattenResponse });
  } catch (err) {
    return next(new LoggerApiError(err, 500));
  }
};

export const FetchChatMessageController: RequestHandler = async (
  req,
  res,
  next
) => {
  const validatedRes = validationResult(req);
  if (!validatedRes.isEmpty()) {
    return next(new BodyValidationError(validatedRes.array()));
  }

  const { recipientId } = req.body as Omit<MessageReqBody, "message">;
  const creatorId = (req.user as ExpressUser).id;
  const cursorId: string | undefined = req.body[CURSOR];
  const cursor: TCursor = cursorId ? { cursor: { id: cursorId } } : {};

  try {
    const chats = await dbClient.message.findMany({
      ...cursor,
      where: {
        OR: [
          {
            creatorId: creatorId,
            messageRecipient: { some: { recipientId: recipientId } },
          },
          {
            creatorId: recipientId,
            messageRecipient: { some: { recipientId: creatorId } },
          },
        ],
      },
      select: {
        id: true,
        creatorId: true,
        messageBody: true,
        isFile: true,
      },
      orderBy: { createdAt: "desc" },
      take: LIMIT,
      skip: cursorId ? 1 : 0,
    });
    const idFilteredChats = chats.map((chat) => ({
      creatorId: chat.creatorId,
      messageBody: chat.messageBody,
      isFile: chat.isFile,
    }));
    res.json({
      data: { chats: idFilteredChats, limit: LIMIT, cursor: chats.at(-1)?.id },
    });
  } catch (err) {
    return next(new LoggerApiError(err, 500));
  }
};

export const FetchSingleLatestMessage: RequestHandler = async (
  req,
  res,
  next
) => {
  const validatedRes = validationResult(req);
  if (!validatedRes.isEmpty()) {
    return next(new BodyValidationError(validatedRes.array()));
  }

  const userId = (req.user as ExpressUser).id;
  const connectedFriendsId = req.body[FRIENDS_IDS] as Array<string>;
  try {
    const latestMsgs: Array<MessageReqBody> = await dbClient.$queryRaw`
    WITH userIds AS (
      SELECT 
        ${userId}::uuid AS userId,
        unnest(${connectedFriendsId}::uuid[]) AS recipientId
    )
    SELECT 
      ui.recipientId AS "id",
      m."messageBody" AS message
    FROM userIds ui
    JOIN LATERAL (
      SELECT m."messageBody"
      FROM "Message" m
      JOIN "MessageRecipient" mr 
        ON m.id = mr."messageId"
      WHERE 
        m."isFile" = false
        AND
        (m."creatorId" = ui.userId AND mr."recipientId" = ui.recipientId)
        OR 
        (m."creatorId" = ui.recipientId AND mr."recipientId" = ui.userId)
      ORDER BY m."createdAt" DESC
      LIMIT 1
    ) m ON true
    ORDER BY ui.userId;
  `;
    res.json({ data: latestMsgs });
  } catch (error) {
    return next(new LoggerApiError(error, 500));
  }
};
