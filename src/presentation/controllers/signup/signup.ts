import { InvalidParamError, MissingParamError } from "../../errors/index"
import { badRequest, ok, serverError } from "../../helper/httpHelper"
import { Controller, HttpRequest, HttpResponse, AddAccount, EmailValidator } from "./signup-protocols"

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ["name", "email", "password", "passwordConfirmation"]
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          console.log(`missingparamerror ${field}`)
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password, passwordConfirmation, name } = httpRequest.body
      if (password !== passwordConfirmation) {
        console.log("missingparamerror(password not the same)")
        return badRequest(new InvalidParamError("passwordConfirmation"))
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        console.log("email_invalid")
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
      return serverError()
    }
  }
}