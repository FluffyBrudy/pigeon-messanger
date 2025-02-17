"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageValidationBody = void 0;
const express_validator_1 = require("express-validator");
const validatorHelper_1 = require("../validatorHelper");
const constants_1 = require("./constants");
exports.messageValidationBody = (0, express_validator_1.body)(constants_1.MESSAGE)
    .exists()
    .withMessage((0, validatorHelper_1.formatFieldDoesntExist)(constants_1.MESSAGE));
