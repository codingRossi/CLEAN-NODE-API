import { RequiredFieldsValidation, ValidationComposite } from "../../../../../validation/validators"
import { Validation } from "../../../../../presentation/protocols/validators"

export const makeAddSurveyValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ["question", "answers"]) {
    validations.push(new RequiredFieldsValidation(field))
  }
  return new ValidationComposite(validations)
}