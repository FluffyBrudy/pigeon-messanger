"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initProfileValidation = void 0;
const express_validator_1 = require("express-validator");
const constants_1 = require("./constants");
const validatorHelper_1 = require("../validatorHelper");
exports.initProfileValidation = (0, express_validator_1.body)(constants_1.IMAGE_URL)
    .exists()
    .withMessage((0, validatorHelper_1.formatFieldDoesntExist)(constants_1.IMAGE_URL))
    .isURL({ require_protocol: true, require_valid_protocol: true })
    .withMessage(constants_1.INVALID_IMAGE_URL)
    .custom((imageUrl) => imageUrl.match(/\.(png|jpg|jpeg|webp)$/i))
    .withMessage(constants_1.NON_IMAGE_URL);
