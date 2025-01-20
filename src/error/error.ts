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

export default ApiError;
