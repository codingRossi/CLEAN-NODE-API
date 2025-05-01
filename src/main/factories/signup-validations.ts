import { RequiredFieldsValidation } from "../../presentation/helper/validators/required-field-validation"
import { ValidationComposite } from "../../presentation/helper/validators/validation-composite"
import { Validation } from "../../presentation/helper/validators/validators"

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ["name", "email", "password", "passwordConfirmation"]) {
    validations.push(new RequiredFieldsValidation(field))
  }
  return new ValidationComposite(validations)
}