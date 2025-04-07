import { AddAccountRepository } from "../../../../data/protocols/add-account-repository";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/use-cases/add-account";
import { MongoHelper } from "../helpers/mongo-helper";

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getColletion('accounts')
    const result = await accountCollection.insertOne(accountData)
    const account = await accountCollection.findOne({ _id: result.insertedId })
    const { _id, ...accountWithoutId } = account
    console.log({ accountWithoutId })
    return {
      id: _id.id.toString(),
      email: accountWithoutId.email as string,
      name: accountWithoutId.name as string,
      password: accountWithoutId.password as string
    }
  }
}