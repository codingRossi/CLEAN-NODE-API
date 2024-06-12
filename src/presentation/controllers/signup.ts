import { MissingParamError } from "../errors/missing-param-error"
import { httpResponse, HttpRequest } from "../protocols/http"
export class SignUpController {
    handle (httpRequest: HttpRequest): httpResponse {
            if (!httpRequest.body.name) { 
                return {
                statusCode: 400,
                body: new MissingParamError('name')
                }
            }

            if (!httpRequest.body.email) {
                return {
                statusCode: 400,
                body: new MissingParamError('email')
                }
            }
        }
    }