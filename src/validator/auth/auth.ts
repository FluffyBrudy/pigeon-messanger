import { emailBody, passwordBody, usernameBody } from "./validatorBody";

export const loginValidator = [emailBody];
export const registerValidator = [usernameBody, emailBody, passwordBody];
