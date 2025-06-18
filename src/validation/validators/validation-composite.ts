import { Validation } from "../../presentation/protocols/validators";

export class ValidationComposite implements Validation {
  constructor(private readonly validations: Validation[]) {}
  validate(input: any): Error {
    for (const validations of this.validations) {
      const error = validations.validate(input)
      if (error) {
        return error
      }
    }
  }
}