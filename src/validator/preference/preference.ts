import { body } from "express-validator";
import { IMAGE_URL, INVALID_IMAGE_URL, NON_IMAGE_URL } from "./constants";
import { formatFieldDoesntExist } from "../validatorHelper";

export const initProfileValidation = body(IMAGE_URL)
  .exists()
  .withMessage(formatFieldDoesntExist(IMAGE_URL))
  .isURL({ require_protocol: true, require_valid_protocol: true })
  .withMessage(INVALID_IMAGE_URL)
  .custom((imageUrl: string) => imageUrl.match(/\.(png|jpg|jpeg|webp|svg)$/i))
  .withMessage(NON_IMAGE_URL);
