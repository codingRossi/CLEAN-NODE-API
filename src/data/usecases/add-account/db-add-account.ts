import { AccountModel, AddAccount, Hasher, AddAccountModel, AddAccountRepository } from "./db-add-account-protocols"

export class DbAddAccount implements AddAccount {
  constructor( private readonly Hasher: Hasher, private readonly addAccountRepository: AddAccountRepository) {}
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedpassword = await this.Hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedpassword }))
    return new Promise(resolve => resolve(account))
  }
}