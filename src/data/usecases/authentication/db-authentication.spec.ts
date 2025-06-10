import { AuthenticationModel } from "../../../domain/use-cases/authentication"
import { HashComparer } from "../../protocols/cryptography/hash-compare"
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository"
import { AccountModel } from "../add-account/db-add-account-protocols"
import { DbAuthentication } from "./db-authentication"


const makeFakeAuthentication = (): AuthenticationModel => ({
    email: "any_email@mail.com",
    password: "any_password"
})
const makeFakeAccount = (): AccountModel => ({
    id: "any_id",
    name: "any_name",
    email: "any_email@mail.com",
    password: "hashed_password"
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async load(email: string): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new LoadAccountByEmailRepositoryStub()
}

const makeHashCompare = (): HashComparer => {
    class HashComparerStub implements HashComparer {
        async compare(value: string, hash: string): Promise<boolean> {
            return new Promise(resolve => resolve(true))
        }
    }
    return new HashComparerStub()
}


interface SutTypes {
    sut: DbAuthentication
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompareStub: HashComparer
}

const makeSut = (): SutTypes => {
    const loadAccountByEmailRepository = makeLoadAccountByEmailRepository()
    const hashCompareStub = makeHashCompare()
    const sut = new DbAuthentication(loadAccountByEmailRepository, hashCompareStub)
    return {
        sut,
        loadAccountByEmailRepository,
        hashCompareStub
    }
}

describe("DbAuthentication", () => {
    test("Should call LoadAccountByEmailRepository with correct email", async () => {
        const { sut, loadAccountByEmailRepository } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepository, "load")
        await sut.auth(makeFakeAuthentication())
        expect(loadSpy).toHaveBeenCalledWith("any_email@mail.com")
    })

    test("Should throws if LoadAccountByEmailRepository throws", async () => {
        const { sut, loadAccountByEmailRepository } = makeSut()
        jest.spyOn(loadAccountByEmailRepository, "load").mockRejectedValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = sut.auth(makeFakeAuthentication())
        expect(promise).rejects.toThrow()
    })

    test("Should return null if LoadAccountByEmailRepository return null", async () => {
        const { sut, loadAccountByEmailRepository } = makeSut()
        jest.spyOn(loadAccountByEmailRepository, "load").mockReturnValueOnce(null)
        const accessToken = await sut.auth(makeFakeAuthentication())
        expect(accessToken).toBeNull()
    })

    test("Should call HashCompare with correct values", async () => {
        const { sut, hashCompareStub } = makeSut()
        const compareSpy = jest.spyOn(hashCompareStub, "compare")
        await sut.auth(makeFakeAuthentication())
        expect(compareSpy).toHaveBeenCalledWith("any_password", "hashed_password")
    })

    test("Should throws if HashCompare throws", async () => {
        const { sut, hashCompareStub } = makeSut()
        jest.spyOn(hashCompareStub, "compare").mockRejectedValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = sut.auth(makeFakeAuthentication())
        expect(promise).rejects.toThrow()
    })
})