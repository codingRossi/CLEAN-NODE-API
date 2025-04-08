import { AddAccountModel } from "../../domain/use-cases/add-account"
import { AccountModel } from "../../domain/models/account"

export interface LogErrorRepository {
  log(stack: string): Promise<void>
}