"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerValidator = exports.loginValidator = void 0;
const validatorBody_1 = require("./validatorBody");
exports.loginValidator = [validatorBody_1.emailBody];
exports.registerValidator = [
    validatorBody_1.usernameBody,
    validatorBody_1.emailBody,
    validatorBody_1.passwordBody,
    validatorBody_1.validImageUrl,
];
