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
exports.LoginController = void 0;
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = require("jsonwebtoken");
const bcryptjs_1 = require("bcryptjs");
const error_1 = require("../../error/error");
const constants_1 = require("../../validator/auth/constants");
const dbClient_1 = require("../../service/dbClient");
const constants_2 = require("./constants");
const LoginController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedRes = (0, express_validator_1.validationResult)(req);
    if (!validatedRes.isEmpty()) {
        return next(new error_1.BodyValidationError(validatedRes.array()));
    }
    const { email, password } = req.body;
    try {
        const user = yield dbClient_1.dbClient.user.findUnique({
            where: { email },
            select: { id: true, password: true, username: true },
        });
        if (!user)
            return next(new error_1.ApiError(401, constants_2.INVALID_CREDENTIALS, true));
        const isValidPassword = (0, bcryptjs_1.compareSync)(password, user.password);
        if (!isValidPassword)
            return next(new error_1.ApiError(401, constants_2.INVALID_CREDENTIALS, true));
        const payload = { id: user.id, [constants_1.USERNAME]: user.username };
        const accessToken = (0, jsonwebtoken_1.sign)(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_LIFE,
        });
        const refreshToken = (0, jsonwebtoken_1.sign)(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_LIFE,
        });
        res.cookie(constants_2.REFRESH_TOKEN, refreshToken, {
            httpOnly: true,
            secure: true,
            signed: true,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            data: { [constants_2.ACCESS_TOKEN]: accessToken, id: user.id },
        });
    }
    catch (error) {
        return next(new error_1.LoggerApiError(error, 500));
    }
});
exports.LoginController = LoginController;
