import { SignUpController } from "./signup"
import { InvalidParamError, MissingParamError, ServerError } from "../../errors"
import { AccountModel, AddAccount, AddAccountModel, EmailValidator, HttpRequest, Validation } from "./signup-protocols"
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
  addAccountStub: AddAccount,
  validationStub: Validation
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
      return null
    }
  }
  return new ValidatorStub()
}

const makeSut = async (): Promise<SutTypes> => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidator()
  const sut = new SignUpController(addAccountStub, validationStub)
  return {
    sut,
    addAccountStub,
    validationStub
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
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
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
})