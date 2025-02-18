import { Router } from "express";
import {
  CreateChatMessageController,
  FetchChatMessageController,
  FetchSingleLatestMessage,
} from "../controller/chat/ChatController";
import {
  createMessageValidation,
  fetchMessageValidation,
  fetchSingleLatestMessageValidation,
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
chatRouter.post(
  CHAT.MESSAGE_SINGLE,
  fetchSingleLatestMessageValidation,
  FetchSingleLatestMessage
);

export { chatRouter };
