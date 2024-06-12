import { httpResponse, HttpRequest } from "../protocols/http"
export class SignUpController {
    handle (httpRequest: HttpRequest): httpResponse {
            if (!httpRequest.body.email) { 
                return {
                statusCode: 400,
                body: new Error('Missing Param Error')
                }
            }

            if (!httpRequest.body.email) {
                return {
                statusCode: 400,
                body: new Error('Missing Param Error')
                }
            }
        }
    }