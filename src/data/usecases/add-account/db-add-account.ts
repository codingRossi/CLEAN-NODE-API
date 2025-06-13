import { AccountModel, AddAccount, Hasher, AddAccountModel, AddAccountRepository, LoadAccountByEmailRepository } from "./db-add-account-protocols"

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly Hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    ) {}
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    const hashedpassword = await this.Hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedpassword }))
    return new Promise(resolve => resolve(account))
  }
}