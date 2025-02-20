import { body } from "express-validator";
import { formatFieldDoesntExist } from "../validatorHelper";
import {
  ALL_ARENT_UUID,
  MESSAGE,
  MUST_CONTAIN_ONE_ID_ERROR,
} from "./constants";
import { FRIENDS_IDS } from "./constants";

export const messageValidationBody = body(MESSAGE)
  .exists()
  .withMessage(formatFieldDoesntExist(MESSAGE));

export const friendsIdsValidation = [
  body(FRIENDS_IDS)
    .exists()
    .withMessage(formatFieldDoesntExist(FRIENDS_IDS))
    .isArray({ min: 1 })
    .withMessage(MUST_CONTAIN_ONE_ID_ERROR)
    .bail(),
  body(`${FRIENDS_IDS}.*`).isUUID().withMessage(ALL_ARENT_UUID),
];
