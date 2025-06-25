import { Decrypter } from "../../protocols/cryptography/decrypter"
import { AccountModel } from "../add-account/db-add-account-protocols"
import { DbLoadAccountByToken } from "./db-load-account-token"
import { LoadAccountByTokenRepository } from "../../protocols/db/account/load-account-by-token-repository"

interface SutTypes {
    sut: DbLoadAccountByToken
    decrypterStub: Decrypter
    loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeFakeAccount = (): AccountModel => ({
    id: "valid_id",
    name: "valid_name",
    email: "valid_email@mail.com",
    password: "hashed_password"
})

const makeDecrypter = (): Decrypter => {
    class DecrypterStub implements Decrypter {
        async decrypt(value: string): Promise<string> {
            return new Promise(resolve => resolve("any_value"))
        }
    }

    return new DecrypterStub()
}

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
        async loadByToken(value: string, role?: string): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }

    return new LoadAccountByTokenRepositoryStub()
}


const makeSut = (): SutTypes => {
    const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository()
    const decrypterStub = makeDecrypter()
    const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
    return {
        sut,
        decrypterStub,
        loadAccountByTokenRepositoryStub
    }
}

describe("DbLoadAccountByToken UseCase", () => {
    test("Should call Decrypter with correct values", async () => {
        const { sut, decrypterStub } = makeSut()
        const decryptSpy = jest.spyOn(decrypterStub, "decrypt")
        await sut.load("any_token", "any_role")
        expect(decryptSpy).toHaveBeenCalledWith("any_token")
    })

    test("Should return null if Decrypter returns null", async () => {
        const { sut, decrypterStub } = makeSut()
        //@ts-expect-error
        jest.spyOn(decrypterStub, "decrypt").mockReturnValueOnce(new Promise(resolve => resolve(null)))
        const account = await sut.load("any_token", "any_role")
        expect(account).toBeNull()
    })

    test("Should call LoadAccountByTokenRepository with correct values", async () => {
        const { sut, loadAccountByTokenRepositoryStub } = makeSut()
        const loadByTokentSpy = jest.spyOn(loadAccountByTokenRepositoryStub, "loadByToken")
        await sut.load("any_token", "any_role")
        expect(loadByTokentSpy).toHaveBeenCalledWith("any_token", "any_role")
    })

    test("Should return null if LoadAccountByTokenRepository returns null", async () => {
        const { sut, loadAccountByTokenRepositoryStub } = makeSut()
        //@ts-expect-error
        jest.spyOn(loadAccountByTokenRepositoryStub, "loadByToken").mockReturnValueOnce(new Promise(resolve => resolve(null)))
        const account = await sut.load("any_token", "any_role")
        expect(account).toBeNull()
    })

})