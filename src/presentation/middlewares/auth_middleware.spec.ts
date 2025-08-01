import { AccessDeniedError } from "../errors"
import { forbidden, ok } from "../helper/http/httpHelper"
import { AuthMiddleware } from "./auth-middlware"
import { AccountModel, LoadAccountByToken, HttpRequest } from "./auth-middlware-protocols"

const makeFakeAccount = (): AccountModel => ({
    id: "valid_id",
    name: "valid-name",
    email: "valid_email@mail.com",
    password: "hashed_password"
})


const makeFakeRequest = (): HttpRequest => ({
    headers: {
        "x-access-token": "any-token"
    }
})


type SutTypes = {
    sut: AuthMiddleware
    loadAccountByTokenStub: LoadAccountByToken
}

const makeLoadAccountByToken = (): LoadAccountByToken => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
        async load(accessToken: string, role?: string): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }

    return new LoadAccountByTokenStub()
}

const makeSut = (role?: string): SutTypes => {
    const loadAccountByTokenStub = makeLoadAccountByToken()
    const sut = new AuthMiddleware(loadAccountByTokenStub, role)
    return {
        sut,
        loadAccountByTokenStub
    }
}



describe("Auth Middlaware", () => {
    test("Should return 403 if no x-access-token exists in headers", async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle({})
        expect(httpResponse).toBe(forbidden(new AccessDeniedError()))
    })

    test("Should call LoadAccountByToken with correct accessToken", async () => {
        const role = "any_role"
        const { sut, loadAccountByTokenStub } = makeSut(role)
        const loadSpy = jest.spyOn(loadAccountByTokenStub, "load")
        await sut.handle(makeFakeRequest())
        expect(loadSpy).toHaveBeenCalledWith("any-token")
    })

    test("Should return 403 if LoadAccountByToken returns null", async () => {
        const { sut, loadAccountByTokenStub } = makeSut()
        jest.spyOn(loadAccountByTokenStub, "load").mockReturnValueOnce(new Promise(resolve => resolve(null)))
        const httpResponse = await sut.handle({})
        expect(httpResponse).toBe(forbidden(new AccessDeniedError()))
    })

    test("Should return 200 if LoadAccountByToken returns an account", async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toBe(ok({
            accountId: "valid_id"
        }))
    })
})