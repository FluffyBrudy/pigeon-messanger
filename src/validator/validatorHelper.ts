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
