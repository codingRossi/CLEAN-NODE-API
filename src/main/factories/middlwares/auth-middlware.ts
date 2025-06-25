import { AuthMiddleware } from "../../../presentation/middlewares/auth-middlware"
import { Middleware } from "../../../presentation/protocols"
import { makeDbLoadAccountByToken } from "../usecases/load-account-by-token/load-account-by-token-factory"

export const makeAuthMiddlware = (role?: string): Middleware => {
    return new AuthMiddleware(makeDbLoadAccountByToken(), role)
}