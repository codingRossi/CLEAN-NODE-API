import { Validation } from "./validators";

export class ValidationComposite implements Validation {
  private readonly validations: Validation[]
  constructor(validations: Validation[]) {
    this.validations = validations
  }
  validate(input: any): Error {
    for (const validations of this.validations) {
      const error = validations.validate(input)
      if (error) {
        return error
      }
    }
  }
}