import { EmailValidator } from "../protocols/emailValidator";

export class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string) {
    return false
  }
}