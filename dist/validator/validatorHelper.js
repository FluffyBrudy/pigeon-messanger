"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idValidation = exports.formatFieldDoesntExist = exports.formatLengthError = void 0;
const express_validator_1 = require("express-validator");
const formatLengthError = (fieldname, minlength, maxlength) => {
    return `${fieldname} must be at least ${minlength} and at most ${maxlength} in length`;
};
exports.formatLengthError = formatLengthError;
const formatFieldDoesntExist = (fieldname) => {
    return `${fieldname} doesn\'t exists`;
};
exports.formatFieldDoesntExist = formatFieldDoesntExist;
/**
 *
 * @param idBodyName {string} body name, defaults to 'id' if no argument passed
 * @param isOptional {boolean} determines wether id body is optional field
 * @returns {ValidationChain}
 */
const idValidation = (idBodyName = "id", isOptional = false) => {
    if (isOptional) {
        return (0, express_validator_1.body)(idBodyName)
            .optional({ values: "null" })
            .trim()
            .isUUID(4)
            .withMessage(`Invalid id ${idBodyName}`);
    }
    else {
        return (0, express_validator_1.body)(idBodyName)
            .exists()
            .withMessage((0, exports.formatFieldDoesntExist)(idBodyName))
            .trim()
            .isUUID(4)
            .withMessage(`Invalid id ${idBodyName}`);
    }
};
exports.idValidation = idValidation;
