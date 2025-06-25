import { CompareFieldsValidation } from "../../../../../validation/validators/compare-fields-validation"
import { EmailValidation } from "../../../../../validation/validators/email-validation"
import { RequiredFieldsValidation } from "../../../../../validation/validators/required-field-validation"
import { ValidationComposite } from "../../../../../validation/validators/validation-composite"
import { Validation } from "../../../../../presentation/protocols/validators"
import { EmailValidator } from "../../../../../validation/protocols/emailValidator"
import { makeAddSurveyController } from "./add-survey-controller-factory"

jest.mock("../../../presentation/helper/validators/validation-composite")

describe("AddSurveyValidation Factory", () => {
    test("Should call Validation composite with all validations", () => {
        makeAddSurveyController()
        const validations: Validation[] = []
        for (const field of ["question", "answers"]) {
            validations.push(new RequiredFieldsValidation(field))
        }
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})