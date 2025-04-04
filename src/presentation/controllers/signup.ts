import { MissingParamError } from "../errors/missingParamError"
import { badRequest } from "../helper/httpHelper"
import { Controller } from "../protocols/controller"
import { HttpRequest, HttpResponse } from "../protocols/http"

export class SignUpController implements Controller {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ["name", "email", "password", "passwordConfirmation"]
    for (const field in requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}