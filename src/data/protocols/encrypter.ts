import { AccountModel } from "../usecases/add-account/db-add-account-protocols"
import { AddAccountModel } from "../usecases/add-account/db-add-account-protocols"

export interface Encrypter {
    encrypt (value: string): Promise<string>
}