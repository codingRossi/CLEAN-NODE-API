import { DbAddAccount } from "../../../../data/usecases/add-account/db-add-account"
import { BcryptAdapter } from "../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter"
import { AccountMongoRepository } from "../../../../infra/db/mongodb/account/account-mongo-repository"
import { SignUpController } from "../../../../presentation/controllers/signup/signup-controller"
import { Controller } from "../../../../presentation/protocols"
import { LogControllerDecorator } from "../../../decorators/log-controller-decorator"
import { LogMongoRepository } from "../../../../infra/db/mongodb/log/log-mongo-repository"
import { makeSignUpValidation } from "./signup-controller-validations"
import { makeDbAuthentication } from "../../usecases/authentication/db-authentication-factory"
import { makeDbaAddAccount } from "../../usecases/add-account/db-add-account-factory"

export const makeSignUpController = (): Controller => {
  return new SignUpController(makeDbaAddAccount(), makeSignUpValidation(), makeDbAuthentication())
}