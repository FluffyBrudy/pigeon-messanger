import {
  emailBody,
  passwordBody,
  usernameBody,
  validImageUrl,
} from "./validatorBody";

export const loginValidator = [emailBody];
export const registerValidator = [
  usernameBody,
  emailBody,
  passwordBody,
  validImageUrl,
];
