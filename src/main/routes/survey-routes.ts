import { Router } from "express";
import { adaptRoute } from "../adapters/express-routes-adapter";
import { makeLogControllerDecorator } from "../factories/decorators/log-controller-decorator-factory";
import { makeLoadSurveyController } from "../factories/controllers/survey/add-survey/load-survey/load-survey-controller-factory";
import { makeAddSurveyController } from "../factories/controllers/survey/add-survey/add-survey-controller-factory";
import { adminAuth } from "../middlwares/admin-auth";
import { auth } from "../middlwares/auth";

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeLogControllerDecorator(makeAddSurveyController())))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveyController()))
}
