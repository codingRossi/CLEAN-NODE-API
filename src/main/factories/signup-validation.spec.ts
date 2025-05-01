import { RequiredFieldsValidation } from "../../presentation/helper/validators/required-field-validation"
import { ValidationComposite } from "../../presentation/helper/validators/validation-composite"
import { Validation } from "../../presentation/helper/validators/validators"
import { makeSignUpValidation } from "./signup-validations"

jest.mock("../../presentation/helper/validators/validation-composite")
describe("SignUpValidation Factory", () => {
  test("Should call Validation composite with all validations", () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ["name", "email", "password", "passwordConfirmation"]) {
      validations.push(new RequiredFieldsValidation(field))
    }
    validations.push(new CompareFieldsValidation("password", "passwordConfirmation"))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})