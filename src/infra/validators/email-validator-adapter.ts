import validator from "validator"
import { EmailValidator } from "../../validation/protocols/emailValidator"

export class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string) {
    return validator.isEmail(email)
  }
}