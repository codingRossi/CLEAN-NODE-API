import { MissingParamError } from "../errors/missing-param-error"
import { httpResponse, HttpRequest } from "../protocols/http"
import { badRequest } from "../helper/http-helper"
export class SignUpController {
    handle (httpRequest: HttpRequest): httpResponse {
            if (!httpRequest.body.name) { 
                return badRequest(new MissingParamError('name'))
                }

            if (!httpRequest.body.email) {
                return badRequest(new MissingParamError('name'))
                }
            }
        }
    