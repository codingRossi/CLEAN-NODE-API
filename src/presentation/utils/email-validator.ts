import { EmailValidator } from "../protocols/emailValidator";
import validator from "validator"

export class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string) {
    return validator.isEmail(email)
  }
}