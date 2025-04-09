import { AccountModel, Encrypter, AddAccountModel, AddAccountRepository } from "./db-add-account-protocols"
import { DbAddAccount } from "./db-add-account"

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve("hashed_password"))
    }
  }
  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class EncrypterStub implements AddAccountRepository {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new EncrypterStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid-name",
  email: "valid_email@mail.com",
  password: "hashed_password"
})

const makeFakeAccountData = (): AddAccountModel => ({
  name: "valid-name",
  email: "valid_email@mail.com",
  password: "valid_password"
})

interface SutTypes {
  sut: DbAddAccount,
  encrypterStub: Encrypter,
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
  }
}

describe("DbAddAccount Usecase", () => {
  test("Should call Encrypter with correct password", async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt")
    await sut.add(makeFakeAccountData())
    expect(encryptSpy).toHaveBeenCalledWith("valid_password")
  })

  test("Should throw if encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, "encrypt").mockRejectedValueOnce(new Error())
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test("Should call AddAccountRepository with correct values", async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add")
    await sut.add(makeFakeAccountData())
    expect(addSpy).toHaveBeenCalledWith({
      name: "valid-name",
      email: "valid_email@mail.com",
      password: "hashed_password"
    })
  })

  test("Should throw if AddAccount throws", async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, "add").mockRejectedValueOnce(new Error())
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test("Should return an account if on success", async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAccountData())
    expect(account).toEqual(makeFakeAccount())
  })
})