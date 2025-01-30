import { body } from "express-validator";
import { INVALIS_SEARCH_TERM, SEARCH_TERM } from "./constants";
import { formatFieldDoesntExist } from "../validatorHelper";

export const searchTermBody = body(SEARCH_TERM)
  .exists()
  .withMessage(formatFieldDoesntExist(SEARCH_TERM))
  .isString()
  .withMessage(INVALIS_SEARCH_TERM);
