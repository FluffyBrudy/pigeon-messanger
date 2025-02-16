import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { BodyValidationError, LoggerApiError } from "../../error/error";
import { ExpressUser, TCursor } from "../../types/common";
import { dbClient } from "../../service/dbClient";
import { CURSOR } from "../../validator/social/constants";

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
        creatorId: true,
        messageBody: true,
        messageRecipient: { select: { recipientId: true } },
      },
    });
    const flattenResponse = {
      creatorId: messageItem.creatorId,
      recipientId: messageItem.messageRecipient[0].recipientId,
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
        creatorId: true,
        messageBody: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json({ data: chats });
  } catch (err) {
    return next(new LoggerApiError(err, 500));
  }
};
