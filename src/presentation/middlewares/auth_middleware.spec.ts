import { AccessDeniedError } from "../errors"
import { forbidden } from "../helper/http/httpHelper"
import { AuthMiddleware } from "./auth-middlware"

describe("Auth Middlaware", () => {
    test("Should return 403 if no x-access-token exists in headers", async () => {
        const sut = new AuthMiddleware()
        const httpResponse = await sut.handle({})
        expect(httpResponse).toBe(forbidden(new AccessDeniedError()))
    })
})