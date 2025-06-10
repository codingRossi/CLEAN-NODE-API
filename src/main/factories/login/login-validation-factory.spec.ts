import { CompareFieldsValidation } from "../../../presentation/helper/validators/compare-fields-validation"
import { EmailValidation } from "../../../presentation/helper/validators/email-validation"
import { RequiredFieldsValidation } from "../../../presentation/helper/validators/required-field-validation"
import { ValidationComposite } from "../../../presentation/helper/validators/validation-composite"
import { Validation } from "../../../presentation/protocols/validators"
import { EmailValidator } from "../../../presentation/protocols/emailValidator"
import { makeLoginValidation } from "./login-validations-factory"

jest.mock("../../../presentation/helper/validators/validation-composite")

const makeEmailValidator = (): EmailValidator => {
  class EmailValidationStub implements EmailValidator {"../../presentation/helper/validators/validation-composite"
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidationStub()
}
describe("LoginValidation Factory", () => {
  test("Should call Validation composite with all validations", () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ["email", "password"]) {
      validations.push(new RequiredFieldsValidation(field))
    }
    validations.push(new EmailValidation("email", makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})