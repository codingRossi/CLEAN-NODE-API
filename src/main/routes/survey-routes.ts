import { Router } from "express";
import { adaptRoute } from "../adapters/express-routes-adapter";
import { makeLogControllerDecorator } from "../factories/decorators/log-controller-decorator-factory";
import { makeAddSurveyController } from "../factories/controllers/add-survey/add-survey-controller-factory";
import { makeAuthMiddlware } from "../factories/middlwares/auth-middlware";
import { adaptMiddlware } from "../adapters/express-middlware-adapter";

export default (router: Router): void => {
  const adminAuth = adaptMiddlware(makeAuthMiddlware("admin"))
  router.post('/surveys', adminAuth, adaptRoute(makeLogControllerDecorator(makeAddSurveyController())))
}
