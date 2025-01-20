const INTERNAL_SERVER_ERROR = "Internal server error";

const formatmsgPrefixOrMsg = (msg: string | undefined) =>
  msg ? msg + " " : "";

class ApiError extends Error {
  public status: number;

  constructor(status: number, msgPrefixOrMsg?: string, fullReplace = false) {
    let errorMsg = formatmsgPrefixOrMsg(msgPrefixOrMsg);

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

export default ApiError;
