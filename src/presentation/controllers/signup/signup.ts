import { InvalidParamError } from "../../errors/index"
import { badRequest, ok, serverError } from "../../helper/httpHelper"
import { Controller, HttpRequest, HttpResponse, AddAccount, Validation } from "./signup-protocols"

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor(addAccount: AddAccount, validation: Validation) {
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