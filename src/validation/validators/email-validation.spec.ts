import { EmailValidation } from "./email-validation"
import { InvalidParamError, ServerError } from "../../errors"
import { EmailValidator } from "../../protocols/emailValidator"
import { serverError } from "../http/httpHelper"

type SutTypes = {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = () => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  return emailValidatorStub
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation("email", emailValidatorStub)
  return {
    sut,
    emailValidatorStub,
  }
}
describe("Email Validation", () => {
  test("Should return an error if Email Validator retuns false", () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false)
    const error = sut.validate({ email: "any_email@mail.com" })
    expect(error).toEqual(new InvalidParamError("email"))
  })

  test("Should call EmailValidator with correct email", () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid")
    sut.validate({
      email: "any_email@gmail.com"
    })
    expect(isValidSpy).toHaveBeenCalledWith("any_email@gmail.com")
  })

  test("Should throws if EmailValidator throws", () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => { throw new Error })
    expect(sut.validate).toThrow()
  })
})