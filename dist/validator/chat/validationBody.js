"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendsIdsValidation = exports.messageValidationBody = void 0;
const express_validator_1 = require("express-validator");
const validatorHelper_1 = require("../validatorHelper");
const constants_1 = require("./constants");
const constants_2 = require("./constants");
exports.messageValidationBody = (0, express_validator_1.body)(constants_1.MESSAGE)
    .exists()
    .withMessage((0, validatorHelper_1.formatFieldDoesntExist)(constants_1.MESSAGE));
exports.friendsIdsValidation = [
    (0, express_validator_1.body)(constants_2.FRIENDS_IDS)
        .exists()
        .withMessage((0, validatorHelper_1.formatFieldDoesntExist)(constants_2.FRIENDS_IDS))
        .isArray({ min: 1 })
        .withMessage(constants_1.MUST_CONTAIN_ONE_ID_ERROR)
        .bail(),
    (0, express_validator_1.body)(`${constants_2.FRIENDS_IDS}.*`).isUUID().withMessage(constants_1.ALL_ARENT_UUID),
];
