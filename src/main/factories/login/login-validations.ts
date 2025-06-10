import { CompareFieldsValidation } from "../../../presentation/helper/validators/compare-fields-validation"
import { EmailValidation } from "../../../presentation/helper/validators/email-validation"
import { RequiredFieldsValidation } from "../../../presentation/helper/validators/required-field-validation"
import { ValidationComposite } from "../../../presentation/helper/validators/validation-composite"
import { Validation } from "../../../presentation/protocols/validators"
import { EmailValidatorAdapter } from "../../../presentation/utils/email-validator-adapter"

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ["email", "password"]) {
    validations.push(new RequiredFieldsValidation(field))
  }
  validations.push(new EmailValidation("email", new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}