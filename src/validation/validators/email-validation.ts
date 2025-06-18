import { InvalidParamError, MissingParamError } from "../../presentation/errors";
import { EmailValidator } from "../../validation/protocols/emailValidator";
import { Validation } from "../../presentation/protocols/validators";

export class EmailValidation implements Validation {
  constructor(private readonly fieldName: string, private readonly emailValidator: EmailValidator) {}
  validate(input: any): Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}