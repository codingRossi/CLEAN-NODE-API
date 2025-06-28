import { AccountMongoRepository, Authentication, BcryptAdapter, DbAuthentication, JwtAdapter } from "./db-authentication-factory-protocols"
import env from "../../../config/env"

export const makeDbAuthentication = (): Authentication => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const jwtAdapter = new JwtAdapter(env.jwtSecret)
    const accountMongoRepository = new AccountMongoRepository()
    return new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)

}