"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyValidationError = exports.LoggerApiError = exports.ApiError = void 0;
const logger_1 = require("../logger/logger");
const INTERNAL_SERVER_ERROR = "Internal server error";
const formatMsg = (msg) => (msg ? msg + " " : "");
class ApiError extends Error {
    /**
     *
     * @param status {number}
     * @param msgPrefixOrMsg {string | undefined}
     * @param fullReplace {boolean} - defaults to false, if set true insted of concatanating message it fully replace error message
     */
    constructor(status, msgPrefixOrMsg, fullReplace = false) {
        let errorMsg = formatMsg(msgPrefixOrMsg);
        switch (status) {
            case 400:
                errorMsg += "bad request";
                break;
            case 401:
                errorMsg += "unauthorized access";
                break;
            case 403:
                errorMsg += "not permitted";
                break;
            case 404:
                errorMsg += "not found";
                break;
            case 409:
                errorMsg += "already exists(conflict)";
                break;
            default:
                errorMsg = INTERNAL_SERVER_ERROR;
        }
        super(fullReplace ? msgPrefixOrMsg : errorMsg);
        Error.captureStackTrace(this, this.constructor);
        this.status = status;
    }
}
exports.ApiError = ApiError;
class LoggerApiError extends ApiError {
    constructor(trueError, status, msgPrefixOrMsg, fullReplace = false) {
        super(status, msgPrefixOrMsg, fullReplace);
        logger_1.logger.error(trueError);
    }
}
exports.LoggerApiError = LoggerApiError;
class BodyValidationError extends Error {
    constructor(errors) {
        super();
        this.message = errors.reduce((accm, curr) => {
            const castedCurr = curr;
            return accm + `${castedCurr.path}: ${curr.msg};`;
        }, "");
        this.status = 400;
        this.name = "ValidationError";
    }
}
exports.BodyValidationError = BodyValidationError;
