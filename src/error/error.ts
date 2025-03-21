import { ValidationError, FieldValidationError } from "express-validator";
import { logger } from "../logger/logger";

const INTERNAL_SERVER_ERROR = "Internal server error";

const formatMsg = (msg: string | undefined) => (msg ? msg + " " : "");

class ApiError extends Error {
  public status: number;
  /**
   *
   * @param status {number}
   * @param msgPrefixOrMsg {string | undefined}
   * @param fullReplace {boolean} - defaults to false, if set true insted of concatanating message it fully replace error message
   */
  constructor(
    status: number,
    msgPrefixOrMsg?: string,
    fullReplace: boolean = false
  ) {
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
/**
 * will logs nothing in production but only developemental
 */
class LoggerApiError extends ApiError {
  constructor(
    trueError: any,
    status: number,
    msgPrefixOrMsg?: string,
    fullReplace: boolean = false
  ) {
    super(status, msgPrefixOrMsg, fullReplace);
    if (process.env.NODE_ENV !== "prod") {
      logger.error(trueError);
    }
  }
}

class BodyValidationError extends Error {
  public status: number;
  constructor(errors: Array<ValidationError>) {
    super();
    this.message = errors.reduce((accm, curr) => {
      const castedCurr = curr as FieldValidationError;
      return accm + `${castedCurr.path}: ${curr.msg};`;
    }, "");
    this.status = 400;
    this.name = "ValidationError";
  }
}

export { ApiError, LoggerApiError, BodyValidationError };
