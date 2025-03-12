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
exports.RegisterController = void 0;
const bcryptjs_1 = require("bcryptjs");
const express_validator_1 = require("express-validator");
const error_1 = require("../../error/error");
const dbClient_1 = require("../../service/dbClient");
const constants_1 = require("./constants");
const RegisterController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedRes = (0, express_validator_1.validationResult)(req);
    if (!validatedRes.isEmpty()) {
        return next(new error_1.BodyValidationError(validatedRes.array()));
    }
    const { username, email, password, imageUrl } = req.body;
    const picture = imageUrl
        ? { profile: { create: { picture: imageUrl } } }
        : {};
    const hashedPassword = (0, bcryptjs_1.hashSync)(password, (0, bcryptjs_1.genSaltSync)());
    try {
        yield dbClient_1.dbClient.$transaction(() => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield dbClient_1.dbClient.user.create({
                data: Object.assign({ username,
                    email, password: hashedPassword }, picture),
                select: { id: true },
            });
            yield dbClient_1.dbClient.profile.create({
                data: { userId: user.id },
            });
        }));
        res.status(200).json({ data: constants_1.USER_SUCCESSFULLY_CREATED });
    }
    catch (error) {
        if (error.code === "P2002")
            return next(new error_1.ApiError(409, "User already exists", true));
        else
            return next(new error_1.LoggerApiError(error, 500));
    }
});
exports.RegisterController = RegisterController;
