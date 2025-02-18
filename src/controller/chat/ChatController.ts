import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { BodyValidationError, LoggerApiError } from "../../error/error";
import { ExpressUser, TCursor } from "../../types/common";
import { dbClient } from "../../service/dbClient";
import { CURSOR } from "../../validator/social/constants";
import { LIMIT } from "./constants";
import { RECIPIENT_ID } from "../../validator/chat/constants";

interface MessageReqBody {
  recipientId: string;
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
      },
    });
    const flattenResponse = {
      creatorId: messageItem.creatorId,
      id: messageItem.id,
      message: messageItem.messageBody,
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
      },
      orderBy: { createdAt: "desc" },
      take: LIMIT,
      skip: cursorId ? 1 : 0,
    });
    const idFilteredChats = chats.map((chat) => ({
      creatorId: chat.creatorId,
      messageBody: chat.messageBody,
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

  const recipientId = req.body[RECIPIENT_ID] as string;
  const creatorId = (req.user as ExpressUser).id;
  try {
    const latestMsg = await dbClient.message.findFirst({
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
        creatorId: true,
        messageBody: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: latestMsg });
  } catch (error) {
    return next(new LoggerApiError(error, 500));
  }
};
