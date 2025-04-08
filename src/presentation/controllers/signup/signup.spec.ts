import { SignUpController } from "./signup"
import { InvalidParamError, MissingParamError, ServerError } from "../../errors"
import { AccountModel, AddAccount, AddAccountModel, EmailValidator } from "./signup-protocols"

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

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const FakeAccount = {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email@gmail.com",
        password: "valid_password",
      }
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
    const { sut } = await await makeSut()
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        password: "any_passoword",
        passwordValidation: "any_password"
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError("name"))
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
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError("email"))
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
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError("password"))
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
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError("passwordConfirmation"))
  })

  test("Should return 400 if an invalid email is provided", async () => {
    const {
      sut,
      emailValidatorStub
    } = await makeSut()
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: "any_name",
        email: "invalid_email",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError("email"))
  })

  test("Should call EmailValidator with correct email", async () => {
    const {
      sut,
      emailValidatorStub
    } = await makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid")
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@gmail.com",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith("any_email@gmail.com")
  })

  test("Should return 500 if EmailValidator throws", async () => {
    const { sut, emailValidatorStub } = await makeSut()
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error
    })
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@gmail.com",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toBeInstanceOf(ServerError)
  })

  test("Should return 400 if passowordConfirmation fails", async () => {
    const { sut } = await makeSut()
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_passoword",
        passwordConfirmation: "another_passoword",
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError("passwordConfirmation"))
  })

  test("Should call AddAccount with correct values", async () => {
    const { sut, addAccountStub } = await makeSut()
    const addSpy = jest.spyOn(addAccountStub, "add")
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@gmail.com",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    }
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@gmail.com",
      password: "any_password",
    })
  })

  test("Should return 500 if AddAccount throws", async () => {
    const { sut, addAccountStub } = await makeSut()
    jest.spyOn(addAccountStub, "add").mockImplementationOnce(() => {
      throw new Error
    })
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@gmail.com",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toBeInstanceOf(ServerError)
  })

  test("Should return 200 if valid data is provided", async () => {
    const { sut } = await makeSut()
    const httpRequest = {
      body: {
        name: "valid_name",
        email: "valid_email",
        password: "valid_password",
        passwordConfirmation: "valid_password"
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email@gmail.com",
      password: "valid_password",
    })
  })
})