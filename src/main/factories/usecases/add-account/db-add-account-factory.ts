import { DbAddAccount } from "@/data/usecases/account/add-account/db-add-account"
import { AddAccount } from "../../../../domain/use-cases/add-account"
import { BcryptAdapter } from "../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter"
import { AccountMongoRepository } from "../../../../infra/db/mongodb/account/account-mongo-repository"

export const makeDbaAddAccount = (): AddAccount => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    const addAccountRepository = new AccountMongoRepository()
    return new DbAddAccount(bcryptAdapter, accountMongoRepository, addAccountRepository)
}