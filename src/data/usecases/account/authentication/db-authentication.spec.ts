
import { AccountModel, Encrypter, HashComparer, LoadAccountByEmailRepository, UpdateAccessTokenRepository } from "../add-account/db-add-account-protocols"
import { AuthenticationModel, DbAuthentication } from "./db-authentication-protocols"


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
        async loadByEmail(email: string): Promise<AccountModel> {
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

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt(id: string): Promise<string> {
            return new Promise(resolve => resolve("any_token"))
        }
    }
    return new EncrypterStub()
}

const makeUpdateAccessEncrypter = (): UpdateAccessTokenRepository => {
    class UpdateAccessEncrypterStub implements UpdateAccessTokenRepository {
        async updateAccessToken(id: string, token: string): Promise<void> {
            return new Promise(resolve => resolve())
        }
    }
    return new UpdateAccessEncrypterStub()
}


type SutTypes = {
    sut: DbAuthentication
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompareStub: HashComparer,
    EncrypterStub: Encrypter
    updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
    const loadAccountByEmailRepository = makeLoadAccountByEmailRepository()
    const hashCompareStub = makeHashCompare()
    const EncrypterStub = makeEncrypter()
    const updateAccessTokenRepositoryStub = makeUpdateAccessEncrypter()
    const sut = new DbAuthentication(loadAccountByEmailRepository, hashCompareStub, EncrypterStub, updateAccessTokenRepositoryStub)
    return {
        sut,
        loadAccountByEmailRepository,
        hashCompareStub,
        EncrypterStub,
        updateAccessTokenRepositoryStub
    }
}

describe("DbAuthentication", () => {
    test("Should call LoadAccountByEmailRepository with correct email", async () => {
        const { sut, loadAccountByEmailRepository } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepository, "loadByEmail")
        await sut.auth(makeFakeAuthentication())
        expect(loadSpy).toHaveBeenCalledWith("any_email@mail.com")
    })

    test("Should throws if LoadAccountByEmailRepository throws", async () => {
        const { sut, loadAccountByEmailRepository } = makeSut()
        jest.spyOn(loadAccountByEmailRepository, "loadByEmail").mockRejectedValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = sut.auth(makeFakeAuthentication())
        expect(promise).rejects.toThrow()
    })

    // test("Should return null if LoadAccountByEmailRepository return null", async () => {
    //     const { sut, loadAccountByEmailRepository } = makeSut()
    //     jest.spyOn(loadAccountByEmailRepository, "loadByEmail").mockReturnValueOnce(null)
    //     const accessToken = await sut.auth(makeFakeAuthentication())
    //     expect(accessToken).toBeNull()
    // })

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

    test("Should return null if HashCompare return false", async () => {
        const { sut, hashCompareStub } = makeSut()
        jest.spyOn(hashCompareStub, "compare").mockReturnValueOnce(new Promise(resolve => resolve(false)))
        const accessToken = await sut.auth(makeFakeAuthentication())
        expect(accessToken).toBeNull()
    })

    test("Should call Encrypter with correct id", async () => {
        const { sut, EncrypterStub } = makeSut()
        const encryptSpy = jest.spyOn(EncrypterStub, "encrypt")
        await sut.auth(makeFakeAuthentication())
        expect(encryptSpy).toHaveBeenCalledWith("any_id")
    })

    test("Should throws if Encrypter throws", async () => {
        const { sut, EncrypterStub } = makeSut()
        jest.spyOn(EncrypterStub, "encrypt").mockRejectedValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = sut.auth(makeFakeAuthentication())
        expect(promise).rejects.toThrow()
    })

    test("Should return a token on success", async () => {
        const { sut } = makeSut()
        const accessToken = await sut.auth(makeFakeAuthentication())
        expect(accessToken).toHaveBeenCalledWith("any_id")
    })

    test("Should call UpdateAccessTokenRepository with correct values", async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut()
        const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, "updateAccessToken")
        await sut.auth(makeFakeAuthentication())
        expect(updateSpy).toHaveBeenCalledWith("any_id", "any_token")
    })

    test("Should throws if UpdateAccessTokenRepository throws", async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut()
        jest.spyOn(updateAccessTokenRepositoryStub, "updateAccessToken").mockRejectedValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = sut.auth(makeFakeAuthentication())
        expect(promise).rejects.toThrow()
    })
})