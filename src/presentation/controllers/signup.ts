import { MissingParamError } from "../errors/missingParamError"
import { badRequest } from "../helper/httpHelper"
import { HttpRequest, HttpResponse } from "../protocols/http"

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ["name", "email"]
    for (const field in requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}