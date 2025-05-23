import { SignUpController } from "./signup"
import { InvalidParamError, MissingParamError, ServerError } from "../../errors"
import { AccountModel, AddAccount, AddAccountModel, EmailValidator, HttpRequest } from "./signup-protocols"
import { badRequest, ok, serverError } from "../../helper/httpHelper"

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
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
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

const makeSut = async (): Promise<SutTypes> => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}
describe("Signup Controller", () => {
  test("Should return 400 if no name is provided", async () => {
    const { sut } = await makeSut()
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        password: "any_passoword",
        passwordValidation: "any_password"
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError("name")))
  })

  test("Should return 400 if no email is provided", async () => {
    const { sut } = await makeSut()
    const httpRequest = {
      body: {
        name: "any_name",
        password: "any_passoword",
        passwordValidation: "any_password"
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")))
  })

  test("Should return 400 if no password is provided", async () => {
    const { sut } = await makeSut()
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        passwordValidation: "any_password"
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")))

  })

  test("Should return 400 if no password confirmation is provided", async () => {
    const { sut } = await makeSut()
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_passoword",
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError("passwordConfirmation")))
  })

  test("Should return 400 if an invalid email is provided", async () => {
    const { sut, emailValidatorStub } = await makeSut()
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")))
  })

  test("Should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = await makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid")
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith("any_email@gmail.com")
  })

  test("Should return 500 if EmailValidator throws", async () => {
    const { sut, emailValidatorStub } = await makeSut()
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => { throw new Error })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test("Should return 400 if passwordConfirmation fails", async () => {
    const { sut } = await makeSut()
    const httpResponse = await sut.handle({
      body: {
        name: "any_name",
        email: "any_email@gmail.com",
        password: "any_password",
        passwordConfirmation: "different_password"
      }
    })
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError("passwordConfirmation"))
  })

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
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test("Should return 200 if valid data is provided", async () => {
    const { sut } = await makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })
})