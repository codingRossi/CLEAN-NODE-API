import { InvalidParamError } from "../../errors/index"
import { badRequest, ok, serverError } from "../../helper/httpHelper"
import { Controller, HttpRequest, HttpResponse, AddAccount, EmailValidator, Validation } from "./signup-protocols"

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor(emailValidator: EmailValidator, addAccount: AddAccount, validation: Validation) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.validation = validation
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password, name } = httpRequest.body
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError("email"))
      }

      const account = await this.addAccount.add({
        email,
        name,
        password
      })

      return ok(account)
    } catch (error) {
      console.error(error)
      return serverError(error)
    }
  }
}