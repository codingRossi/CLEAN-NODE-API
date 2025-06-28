import { AccountMongoRepository, DbLoadAccountByToken, JwtAdapter, LoadAccountByToken } from "./load-account-by-token-protocols"
import env from "../../../config/env"

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
    const jwtAdapter = new JwtAdapter(env.jwtSecret)
    const accountMongoRepository = new AccountMongoRepository()
    return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
}