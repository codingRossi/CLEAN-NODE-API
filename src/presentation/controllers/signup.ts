import { InvalidParamError } from "../errors/invalidParamError"
import { MissingParamError } from "../errors/missingParamError"
import { badRequest } from "../helper/httpHelper"
import { Controller } from "../protocols/controller"
import { EmailValidator } from "../protocols/emailValidator"
import { HttpRequest, HttpResponse } from "../protocols/http"

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ["name", "email", "password", "passwordConfirmation"]
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const isValid = this.emailValidator.isValid(httpRequest.body.email)
    if (!isValid) {
      return badRequest(new InvalidParamError("email"))
    }
  }
}