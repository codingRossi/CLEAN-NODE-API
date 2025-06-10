import { Router } from "express";
import { adaptRoute } from "../../main/adapters/express/express-routes-adapter";
import { makeSignUpController } from "../factories/signup/signup"; 

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
}
