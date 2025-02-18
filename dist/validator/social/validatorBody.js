"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTermBody = void 0;
const express_validator_1 = require("express-validator");
const constants_1 = require("./constants");
const validatorHelper_1 = require("../validatorHelper");
exports.searchTermBody = (0, express_validator_1.body)(constants_1.SEARCH_TERM)
    .exists()
    .withMessage((0, validatorHelper_1.formatFieldDoesntExist)(constants_1.SEARCH_TERM))
    .isString()
    .withMessage(constants_1.INVALIS_SEARCH_TERM);
