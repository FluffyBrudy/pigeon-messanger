"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = void 0;
const express_1 = require("express");
const ChatController_1 = require("../controller/chat/ChatController");
const chat_1 = require("../validator/chat/chat");
const constants_1 = require("./constants");
const chatRouter = (0, express_1.Router)();
exports.chatRouter = chatRouter;
chatRouter.post(constants_1.CHAT.MESSAGE_CREATE, chat_1.createMessageValidation, ChatController_1.CreateChatMessageController);
chatRouter.post(constants_1.CHAT.MESSAGE_FETCH, chat_1.fetchMessageValidation, ChatController_1.FetchChatMessageController);
