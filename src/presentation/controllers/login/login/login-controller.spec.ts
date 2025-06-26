import { LoginController } from "./login-controller"
import { badRequest, ok, serverError, unauthorized } from "../../../helper/http/httpHelper"
import { HttpRequest, EmailValidator, Authentication, AuthenticationModel } from "./login-controller-protocols";
import { MissingParamError, ServerError } from "../../../errors";
import { Validation } from "../../../protocols/validators";

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationModel): Promise<string> {
      return new Promise(resolve => resolve("any_token"))
    }
  }
  return new AuthenticationStub()
}

const makeValidation = (): Validation => {
  class ValidatorStub implements Validation {
    validate(input: any): Error {
      return new ServerError("any_error")
    }
  }
  return new ValidatorStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: "any_email@gmail.com",
    password: "any_password"
  }
})
type SutTypes = {
  sut: LoginController,
  authenticationStub: Authentication
  validationStub: Validation
}
const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication()
  const validationStub = makeValidation()
  const sut = new LoginController(validationStub, authenticationStub)
  return {
    sut,
    authenticationStub,
    validationStub,
  }
}
describe("Login controller", () => {
  test("Should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, "auth")
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: "any_email@gmail.com", password: "any_password" })
  })

  test("Should return 401 if invalid credentials are provided", async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, "auth").mockReturnValueOnce(new Promise(resolve => resolve("any_error")))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test("Should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, "auth").mockReturnValueOnce(new Promise((resolve, rejects) => rejects(new Error())))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test("Should return 200 if valid credentials are provided", async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({
      accessToken: "any_token"
    }))
  })

  test("Should call validation with correct value", async () => {
    const { sut, validationStub } = await makeSut()
    const validateSpy = jest.spyOn(validationStub, "validate")
    const HttpRequest = makeFakeRequest()
    await sut.handle(HttpRequest)
    expect(validateSpy).toHaveBeenCalledWith(HttpRequest.body)
  })

  test("Should return 400 if validation returns an error", async () => {
    const { sut, validationStub } = await makeSut()
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new MissingParamError("any_field"))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError("any_field")))
  })
})