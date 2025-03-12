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
exports.SetInitProfileController = exports.GetProfileSignatureController = void 0;
const express_validator_1 = require("express-validator");
const error_1 = require("../../error/error");
const signature_1 = require("../utils/signature");
const dbClient_1 = require("../../service/dbClient");
const GetProfileSignatureController = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const signature = (0, signature_1.createProfileSignature)();
    res.json({ data: signature });
});
exports.GetProfileSignatureController = GetProfileSignatureController;
const SetInitProfileController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedRes = (0, express_validator_1.validationResult)(req);
    if (!validatedRes.isEmpty()) {
        return next(new error_1.BodyValidationError(validatedRes.array()));
    }
    const userId = req.user.id;
    const imageUrl = req.body.imageUrl;
    try {
        yield dbClient_1.dbClient.profile.update({
            where: { userId: userId },
            data: { picture: imageUrl, initialized: true },
        });
        res.json({ data: { imageUrl } });
    }
    catch (error) {
        console.error(error.message);
        return next(new error_1.LoggerApiError(error, 500));
    }
});
exports.SetInitProfileController = SetInitProfileController;
