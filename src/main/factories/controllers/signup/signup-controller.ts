import { Controller } from "../../../../presentation/protocols"
import { makeSignUpValidation } from "./signup-controller-validations"
import { makeDbAuthentication } from "../../usecases/authentication/db-authentication-factory"
import { makeDbaAddAccount } from "../../usecases/add-account/db-add-account-factory"
import { SignUpController } from "../../../../presentation/controllers/login/signup/signup-controller"

export const makeSignUpController = (): Controller => {
  return new SignUpController(makeDbaAddAccount(), makeSignUpValidation(), makeDbAuthentication())
}