import { InvalidParamError, MissingParamError } from "../../errors";
import { EmailValidator } from "../../protocols/emailValidator";
import { badRequest } from "../http/httpHelper";
import { Validation } from "../../protocols/validators";

export class EmailValidation implements Validation {
  constructor(private readonly fieldName: string, private readonly emailValidator: EmailValidator) {}
  validate(input: any): Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}