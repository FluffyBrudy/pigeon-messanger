import { body } from "express-validator";
import {
  EMAIL,
  PASSWORD,
  USERNAME,
  INVALID_EMAIL_FORMAT,
  MAX_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
  WEAK_PASSWOR_ERROR,
  INVALID_IMAGE_URL,
} from "./constants";
import { formatFieldDoesntExist, formatLengthError } from "../validatorHelper";
import { IMAGE_URL } from "../preference/constants";

export const usernameBody = body(USERNAME)
  .exists()
  .withMessage(formatFieldDoesntExist(USERNAME))
  .trim()
  .isLength({ min: MIN_USERNAME_LENGTH, max: MAX_USERNAME_LENGTH })
  .withMessage(
    formatLengthError(USERNAME, MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH)
  );

export const emailBody = body(EMAIL)
  .exists()
  .withMessage(formatFieldDoesntExist(EMAIL))
  .trim()
  .isEmail()
  .withMessage(INVALID_EMAIL_FORMAT);

export const passwordExists = body(PASSWORD)
  .exists()
  .withMessage(formatFieldDoesntExist(PASSWORD));

export const passwordBody = passwordExists
  .trim()
  .isLength({ min: MIN_PASSWORD_LENGTH, max: MAX_PASSWORD_LENGTH })
  .withMessage(
    formatLengthError(PASSWORD, MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH)
  )
  .isStrongPassword()
  .withMessage(WEAK_PASSWOR_ERROR);

export const validImageUrl = body(IMAGE_URL)
  .optional()
  .trim()
  .isURL()
  .withMessage(INVALID_IMAGE_URL);
