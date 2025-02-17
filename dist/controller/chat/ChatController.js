"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchChatMessageController = exports.CreateChatMessageController = void 0;
const express_validator_1 = require("express-validator");
const error_1 = require("../../error/error");
const dbClient_1 = require("../../service/dbClient");
const constants_1 = require("../../validator/social/constants");
const constants_2 = require("./constants");
const CreateChatMessageController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedRes = (0, express_validator_1.validationResult)(req);
    if (!validatedRes.isEmpty()) {
        return next(new error_1.BodyValidationError(validatedRes.array()));
    }
    const creatorId = req.user.id;
    const { recipientId, message } = req.body;
    try {
        const messageItem = yield dbClient_1.dbClient.message.create({
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
    }
    catch (err) {
        return next(new error_1.LoggerApiError(err, 500));
    }
});
exports.CreateChatMessageController = CreateChatMessageController;
const FetchChatMessageController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const validatedRes = (0, express_validator_1.validationResult)(req);
    if (!validatedRes.isEmpty()) {
        return next(new error_1.BodyValidationError(validatedRes.array()));
    }
    const { recipientId } = req.body;
    const creatorId = req.user.id;
    const cursorId = req.body[constants_1.CURSOR];
    const cursor = cursorId ? { cursor: { id: cursorId } } : {};
    try {
        const chats = yield dbClient_1.dbClient.message.findMany(Object.assign(Object.assign({}, cursor), { where: {
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
            }, select: {
                id: true,
                creatorId: true,
                messageBody: true,
            }, orderBy: { createdAt: "desc" }, take: constants_2.LIMIT, skip: cursorId ? 1 : 0 }));
        const idFilteredChats = chats.map((chat) => ({
            creatorId: chat.creatorId,
            messageBody: chat.messageBody,
        }));
        res.json({
            data: { chats: idFilteredChats, limit: constants_2.LIMIT, cursor: (_a = chats.at(-1)) === null || _a === void 0 ? void 0 : _a.id },
        });
    }
    catch (err) {
        return next(new error_1.LoggerApiError(err, 500));
    }
});
exports.FetchChatMessageController = FetchChatMessageController;
