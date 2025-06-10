import { CompareFieldsValidation } from "../../../presentation/helper/validators/compare-fields-validation"
import { EmailValidation } from "../../../presentation/helper/validators/email-validation"
import { RequiredFieldsValidation } from "../../../presentation/helper/validators/required-field-validation"
import { ValidationComposite } from "../../../presentation/helper/validators/validation-composite"
import { Validation } from "../../../presentation/protocols/validators"
import { makeSignUpValidation } from "./signup-validations" 
import { EmailValidator } from "../../../presentation/protocols/emailValidator"

jest.mock("../../../presentation/helper/validators/validation-composite")

const makeEmailValidator = (): EmailValidator => {
  class EmailValidationStub implements EmailValidator {"../../presentation/helper/validators/validation-composite"
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidationStub()
}
describe("SignUpValidation Factory", () => {
  test("Should call Validation composite with all validations", () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ["name", "email", "password", "passwordConfirmation"]) {
      validations.push(new RequiredFieldsValidation(field))
    }
    validations.push(new CompareFieldsValidation("password", "passwordConfirmation"))
    validations.push(new EmailValidation("email", makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})