import { body, ValidationChain } from "express-validator";

type FormatError = (
  fieldname: string,
  minlength: number,
  maxlength: number
) => string;

export const formatLengthError: FormatError = (
  fieldname,
  minlength,
  maxlength
) => {
  return `${fieldname} must be at least ${minlength} and at most ${maxlength} in length`;
};

export const formatFieldDoesntExist = (fieldname: string) => {
  return `${fieldname} doesn\'t exists`;
};

/**
 *
 * @param idBodyName {string} body name, defaults to 'id' if no argument passed
 * @param isOptional {boolean} determines wether id body is optional field
 * @returns {ValidationChain}
 */
export const idValidation = (
  idBodyName: string = "id",
  isOptional: boolean = false
): ValidationChain => {
  if (isOptional) {
    return body(idBodyName)
      .optional({ values: "null" })
      .trim()
      .isUUID(4)
      .withMessage(`Invalid id ${idBodyName}`);
  } else {
    return body(idBodyName)
      .exists()
      .withMessage(formatFieldDoesntExist(idBodyName))
      .trim()
      .isUUID(4)
      .withMessage(`Invalid id ${idBodyName}`);
  }
};
