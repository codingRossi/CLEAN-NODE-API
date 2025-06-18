import { DbAddAccount } from "../../../../data/usecases/add-account/db-add-account"
import { DbAuthentication } from "../../../../data/usecases/authentication/db-authentication"
import { AddAccount } from "../../../../domain/use-cases/add-account"
import { BcryptAdapter } from "../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter"
import { JwtAdapter } from "../../../../infra/criptography/jwt-adapter/jwt-adapter"
import { AccountMongoRepository } from "../../../../infra/db/mongodb/account/account-mongo-repository"
import env from "../../../config/env"

export const makeDbaAddAccount = (): AddAccount => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    const addAccountRepository = new AccountMongoRepository()
    return new DbAddAccount(bcryptAdapter, accountMongoRepository, addAccountRepository)
}