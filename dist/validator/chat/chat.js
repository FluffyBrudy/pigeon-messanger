"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMessageValidation = exports.createMessageValidation = void 0;
const constants_1 = require("../social/constants");
const validatorHelper_1 = require("../validatorHelper");
const constants_2 = require("./constants");
const validationBody_1 = require("./validationBody");
exports.createMessageValidation = [
    (0, validatorHelper_1.idValidation)(constants_2.RECIPIENT_ID),
    validationBody_1.messageValidationBody,
];
exports.fetchMessageValidation = [
    (0, validatorHelper_1.idValidation)(constants_2.RECIPIENT_ID),
    (0, validatorHelper_1.idValidation)(constants_1.CURSOR, true),
];
