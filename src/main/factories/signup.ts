import { DbAddAccount } from "../../data/usecases/add-account/db-add-account"
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter"
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account"
import { SignUpController } from "../../presentation/controllers/signup/signup"
import { Controller } from "../../presentation/protocols"
import { EmailValidatorAdapter } from "../../presentation/utils/email-validator-adapter"
import { LogControllerDecorator } from "../decorators/log"
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log"

export const makeSignUpController = (): Controller => {
  const salt = 12
  const emailValidator = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const signUpController = new SignUpController(emailValidator, dbAddAccount)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}