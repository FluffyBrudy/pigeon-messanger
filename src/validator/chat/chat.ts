import { CURSOR } from "../social/constants";
import { idValidation } from "../validatorHelper";
import { RECIPIENT_ID } from "./constants";
import { messageValidationBody } from "./validationBody";

export const createMessageValidation = [
  idValidation(RECIPIENT_ID),
  messageValidationBody,
];

export const fetchMessageValidation = [
  idValidation(RECIPIENT_ID),
  idValidation(CURSOR, true),
];
