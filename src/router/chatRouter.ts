import { Router } from "express";
import {
  CreateChatMessageController,
  FetchChatMessageController,
} from "../controller/chat/ChatController";
import {
  createMessageValidation,
  fetchMessageValidation,
} from "../validator/chat/chat";
import { CHAT } from "./constants";

const chatRouter = Router();

chatRouter.post(
  CHAT.MESSAGE_CREATE,
  createMessageValidation,
  CreateChatMessageController
);
chatRouter.post(
  CHAT.MESSAGE_FETCH,
  fetchMessageValidation,
  FetchChatMessageController
);

export { chatRouter };
