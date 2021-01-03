import { FieldError } from "../generated/graphql";

export const toErrorMap = (errors: FieldError[]) => {
  // Record type is for dictionary(or object) form
  const errorMap: Record<string, string> = {};
  errors.forEach(({ field, message }) => {
    errorMap[field] = message;
  });
  return errorMap;
};
