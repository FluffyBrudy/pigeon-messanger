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
exports.silentRouter = void 0;
const express_1 = require("express");
const constants_1 = require("./constants");
const error_1 = require("../error/error");
const dbClient_1 = require("../service/dbClient");
const constants_2 = require("../controller/auth/constants");
const silentRouter = (0, express_1.Router)();
exports.silentRouter = silentRouter;
silentRouter.post(constants_1.SILENT.LOGIN, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const id = req.user.id;
    try {
        const user = yield dbClient_1.dbClient.user.findUnique({
            where: { id },
            select: {
                id: true,
                password: true,
                username: true,
                profile: { select: { initialized: true, picture: true } },
            },
        });
        if (!user)
            return next(new error_1.ApiError(401, constants_2.INVALID_CREDENTIALS, true));
        res.json({
            id: user.id,
            username: user.username,
            initialized: (_a = user.profile) === null || _a === void 0 ? void 0 : _a.initialized,
            imageUrl: (_b = user.profile) === null || _b === void 0 ? void 0 : _b.picture,
        });
    }
    catch (err) {
        return next(new error_1.LoggerApiError(err, 500));
    }
}));
