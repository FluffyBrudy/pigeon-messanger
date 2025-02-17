"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordBody = exports.passwordExists = exports.emailBody = exports.usernameBody = void 0;
const express_validator_1 = require("express-validator");
const constants_1 = require("./constants");
const validatorHelper_1 = require("../validatorHelper");
exports.usernameBody = (0, express_validator_1.body)(constants_1.USERNAME)
    .exists()
    .withMessage((0, validatorHelper_1.formatFieldDoesntExist)(constants_1.USERNAME))
    .trim()
    .isLength({ min: constants_1.MIN_USERNAME_LENGTH, max: constants_1.MAX_USERNAME_LENGTH })
    .withMessage((0, validatorHelper_1.formatLengthError)(constants_1.USERNAME, constants_1.MIN_USERNAME_LENGTH, constants_1.MAX_USERNAME_LENGTH));
exports.emailBody = (0, express_validator_1.body)(constants_1.EMAIL)
    .exists()
    .withMessage((0, validatorHelper_1.formatFieldDoesntExist)(constants_1.EMAIL))
    .trim()
    .isEmail()
    .withMessage(constants_1.INVALID_EMAIL_FORMAT);
exports.passwordExists = (0, express_validator_1.body)(constants_1.PASSWORD)
    .exists()
    .withMessage((0, validatorHelper_1.formatFieldDoesntExist)(constants_1.PASSWORD));
exports.passwordBody = exports.passwordExists
    .trim()
    .isLength({ min: constants_1.MIN_PASSWORD_LENGTH, max: constants_1.MAX_PASSWORD_LENGTH })
    .withMessage((0, validatorHelper_1.formatLengthError)(constants_1.PASSWORD, constants_1.MIN_USERNAME_LENGTH, constants_1.MAX_USERNAME_LENGTH))
    .isStrongPassword()
    .withMessage(constants_1.WEAK_PASSWOR_ERROR);
