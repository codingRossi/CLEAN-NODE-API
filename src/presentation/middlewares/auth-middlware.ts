import { HttpRequest, HttpResponse, LoadAccountByToken, Middleware } from "./auth-middlware-protocols";
import { forbidden, ok, serverError } from "../helper/http/httpHelper";
import { AccessDeniedError } from "../errors";

export class AuthMiddleware implements Middleware {
    constructor(
        private readonly loadAccountByToken: LoadAccountByToken,
        private readonly role?: string
    ) { }
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const accessToken = httpRequest.headers?.["x-access-token"]
            if (accessToken) {
                const account = await this.loadAccountByToken.load(accessToken, this.role)
                if (account) {
                    return ok({ accountId: account.id })
                }
            }
            return forbidden(new AccessDeniedError())
        } catch (error) {
            return serverError(error)
        }
    }
}