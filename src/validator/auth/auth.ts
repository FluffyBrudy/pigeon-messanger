import { emailBody, passwordBody, usernameBody } from "./validatorBody";

export const loginValidator = [emailBody, passwordBody];
export const registerValidator = [usernameBody, emailBody, passwordBody];
