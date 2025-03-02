import { body } from "express-validator";
import { IMAGE_URL, INVALID_IMAGE_URL } from "./constants";
import { formatFieldDoesntExist } from "../validatorHelper";

export const initProfileValidation = body(IMAGE_URL)
  .exists()
  .withMessage(formatFieldDoesntExist(IMAGE_URL))
  .isURL()
  .withMessage(INVALID_IMAGE_URL);
