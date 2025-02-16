import { body } from "express-validator";
import { formatFieldDoesntExist } from "../validatorHelper";
import { MESSAGE } from "./constants";

export const messageValidationBody = body(MESSAGE)
  .exists()
  .withMessage(formatFieldDoesntExist(MESSAGE));
