import { resolve } from "path";
import { AccessDeniedError } from "../errors";
import { forbidden } from "../helper/http/httpHelper";
import { HttpRequest, HttpResponse } from "../protocols";
import { Middleware } from "../protocols";

export class AuthMiddleware implements Middleware {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const error = forbidden(new AccessDeniedError())
        return new Promise(resolve => resolve(error))
    }
}