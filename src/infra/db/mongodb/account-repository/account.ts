import { AddAccountRepository } from "../../../../data/protocols/db/add-account-repository"; 
import { LoadAccountByEmailRepository } from "../../../../data/protocols/db/load-account-by-email-repository";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/use-cases/add-account";
import { MongoHelper } from "../helpers/mongo-helper"

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getColletion('accounts')
    const result = await accountCollection.insertOne(accountData)
    return MongoHelper.map(await accountCollection.findOne({ _id: result.insertedId }))
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getColletion('accounts')
    const account = await accountCollection.findOne({ email })
    return account && MongoHelper.map(account)
  }
}