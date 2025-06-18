import { SignUpController } from "./signup-controller"
import { InvalidParamError, MissingParamError, ServerError } from "../../errors"
import { AccountModel, AddAccount, AddAccountModel, EmailValidator, HttpRequest, Validation } from "./signup-controller-protocols"
import { badRequest, ok, serverError, unauthorized } from "../../helper/http/httpHelper"
import { Authentication, AuthenticationModel } from "../login/login-controller-protocols"

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "any_email@gmail.com",
    password: "any_password",
    passwordConfirmation: "any_password"
  }
})

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount,
  validationStub: Validation
  authenticationStub: Authentication
}

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@gmail.com",
  password: "valid_password",
})

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const FakeAccount = makeFakeAccount()
      return new Promise(resolve => resolve(FakeAccount))
    }
  }
  return new AddAccountStub()
}

const makeValidator = (): Validation => {
  class ValidatorStub implements Validation {
    validate(input: any): Error {
      return new ServerError("error")
    }
  }
  return new ValidatorStub()
}


const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationModel): Promise<string> {
      return new Promise(resolve => resolve("any_token"))
    }
  }
  return new AuthenticationStub()
}


const makeSut = async (): Promise<SutTypes> => {
  const authenticationStub = makeAuthentication()
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidator()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}
describe("Signup Controller", () => {
  test("Should call AddAccount with correct values", async () => {
    const { sut, addAccountStub } = await makeSut()
    const addSpy = jest.spyOn(addAccountStub, "add")
    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@gmail.com",
      password: "any_password",
    })
  })

  test("Should return 500 if AddAccount throws", async () => {
    const { sut, addAccountStub } = await makeSut()
    jest.spyOn(addAccountStub, "add").mockImplementationOnce(() => { throw new Error })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError("any error")))
  })

  test("Should return 200 if valid data is provided", async () => {
    const { sut } = await makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test("Should return 400 if validation returns an error", async () => {
    const { sut, validationStub } = await makeSut()
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new MissingParamError("any_field"))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError("any_field")))
  })

  test("Should call Authentication with correct values", async () => {
      const { sut, authenticationStub } = await makeSut()
      const authSpy = jest.spyOn(authenticationStub, "auth")
      await sut.handle(makeFakeRequest())
      expect(authSpy).toHaveBeenCalledWith({email: "any_email@gmail.com", password: "any_password"})
    })
})