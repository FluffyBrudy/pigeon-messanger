import { body } from "express-validator";
import {
  CURSOR,
  INVALID_UUID,
  INVALIS_SEARCH_TERM,
  SEARCH_TERM,
} from "./constants";
import { formatFieldDoesntExist } from "../validatorHelper";

export const cursorOptionalBody = body(CURSOR)
  .optional({ values: "null" })
  .trim()
  .isUUID(4)
  .withMessage(INVALID_UUID);

export const searchTermBody = body(SEARCH_TERM)
  .exists()
  .withMessage(formatFieldDoesntExist(SEARCH_TERM))
  .isString()
  .withMessage(INVALIS_SEARCH_TERM);
