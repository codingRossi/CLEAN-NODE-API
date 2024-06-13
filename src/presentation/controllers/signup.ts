import { MissingParamError, InvalidParamError } from "../errors"
import { httpResponse, HttpRequest, Controller } from "../protocols"
import { EmailValidator } from "../protocols/email-validator"
import { badRequest, serverError, ok } from "../helper/http-helper"
import { AddAccount } from "../../domain/use-cases/add-account"


export class SignUpController  implements Controller{
    private readonly emailValidator: EmailValidator
    private readonly addAccount: AddAccount

    constructor (emailValidator: EmailValidator, addAccount: AddAccount){
        this.emailValidator = emailValidator
        this.addAccount = addAccount
    }
    async handle (httpRequest: HttpRequest): Promise<httpResponse> {
        try {
        const requiredFields = [ 'name', 'email', 'password', 'passwordConfirmation']
        for (const field of requiredFields) {
        if(!httpRequest.body[field]) {
            return badRequest(new MissingParamError(field))
        }
    }
    const { name, email, password, passwordConfirmation } = httpRequest.body
    if (password !== httpRequest.body.passwordConfirmation)  {
        return badRequest(new InvalidParamError('passwordConfirmation'))
    }
    const isValid = this.emailValidator.isValid(email)
    if ( !isValid ) {
        return badRequest(new InvalidParamError('email'))
    }
    const account = await this.addAccount.add({
        name,
        email,
        password
    })
    return ok(account)
    } catch (error) {
        console.error(error)
        return serverError()
    }
 } 
}
    