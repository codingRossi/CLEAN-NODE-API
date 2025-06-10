import { AddAccountModel } from "../../../../domain/use-cases/add-account"
import { AccountModel } from "../../../../domain/models/account"

export interface LogErrorRepository {
  logError(stack: string): Promise<void>
}