import { Router } from "express";
import { adaptRoute } from "../adapters/express-routes-adapter";
import { makeSignUpController } from "../factories/controllers/signup/signup-controller";
import { makeLoginController } from "../factories/controllers/login/login-controller-factory";
import { makeLogControllerDecorator } from "../factories/decorators/log-controller-decorator-factory";

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeLogControllerDecorator(makeSignUpController())))
  router.post("/login", adaptRoute(makeLogControllerDecorator(makeLoginController())))
}
