import { LoginController } from "../../../../presentation/controllers/login/login/login-controller"
import { Controller } from "../../../../presentation/protocols"
import { makeLoginValidation } from "./login-controller-validations-factory"
import { makeDbAuthentication } from "../../usecases/authentication/db-authentication-factory"

export const makeLoginController = (): Controller => {
    return new LoginController(makeLoginValidation(), makeDbAuthentication())
}