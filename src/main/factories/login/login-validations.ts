import { EmailValidation , RequiredFieldsValidation, ValidationComposite} from "../../../presentation/helper/validators"
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