import { Router } from "express";
import { adaptRoute } from "../adapters/express-routes-adapter";
import { makeLogControllerDecorator } from "../factories/decorators/log-controller-decorator-factory";
import { makeAuthMiddlware } from "../factories/middlwares/auth-middlware";
import { adaptMiddlware } from "../adapters/express-middlware-adapter";
import { makeLoadSurveyController } from "../factories/controllers/survey/add-survey/load-survey/load-survey-controller-factory";
import { makeAddSurveyController } from "../factories/controllers/survey/add-survey/add-survey-controller-factory";

export default (router: Router): void => {
  const adminAuth = adaptMiddlware(makeAuthMiddlware("admin"))
  const auth = adaptMiddlware(makeAuthMiddlware())
  router.post('/surveys', adminAuth, adaptRoute(makeLogControllerDecorator(makeAddSurveyController())))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveyController()))
}
