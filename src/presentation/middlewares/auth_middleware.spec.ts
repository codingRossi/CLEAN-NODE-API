import { AccessDeniedError } from "../errors"
import { forbidden } from "../helper/http/httpHelper"
import { AuthMiddleware } from "./auth-middlware"
import { LoadAccountByToken } from "../../domain/use-cases/load-account-by-token"
import { AccountModel } from "../../domain/models/account"


const makeFakeAccount = (): AccountModel => ({
    id: "valid_id",
    name: "valid-name",
    email: "valid_email@mail.com",
    password: "hashed_password"
})

class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
        return new Promise(resolve => resolve(makeFakeAccount()))
    }
}
const loadAccountByTokenStub = new LoadAccountByTokenStub()

describe("Auth Middlaware", () => {
    test("Should return 403 if no x-access-token exists in headers", async () => {
        const sut = new AuthMiddleware(loadAccountByTokenStub)
        const httpResponse = await sut.handle({})
        expect(httpResponse).toBe(forbidden(new AccessDeniedError()))
    })

    test("Should call LoadAccountByToken with correct accessToken", async () => {

        const loadSpy = jest.spyOn(loadAccountByTokenStub, "load")
        const sut = new AuthMiddleware(loadAccountByTokenStub)
        await sut.handle({
            headers: {
                "x-access-token": "any-token"
            }
        })
        expect(loadSpy).toHaveBeenCalledWith("any-token")
    })
})