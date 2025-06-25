import { AccessDeniedError } from "../errors";
import { forbidden } from "../helper/http/httpHelper";
import { HttpRequest, HttpResponse } from "../protocols";
import { Middleware } from "../protocols";
import { LoadAccountByToken } from "../../domain/use-cases/load-account-by-token";

export class AuthMiddleware implements Middleware {
    constructor(
        private readonly loadAccountByToken: LoadAccountByToken
    ) { }
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const accessToken = httpRequest.headers?.["x-access-token"]
        if (accessToken) {
            await this.loadAccountByToken.load(accessToken)
        }
        return forbidden(new AccessDeniedError())
    }
}