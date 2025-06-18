import { EmailInUserError, InvalidParamError } from "../../../errors/index"
import { badRequest, forbidden, ok, serverError } from "../../../helper/http/httpHelper"
import { Authentication } from "../login/login-controller-protocols"
import { Controller, HttpRequest, HttpResponse, AddAccount, Validation } from "./signup-controller-protocols"

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password, name } = httpRequest.body
      const account = await this.addAccount.add({
        email,
        name,
        password
      })
      if (!account) {
        return forbidden(new EmailInUserError())
      }
      const accessToken = this.authentication.auth({
        email,
        password
      })
      return ok({ accessToken })
    } catch (error) {
      console.error(error)
      return serverError(error)
    }
  }
}