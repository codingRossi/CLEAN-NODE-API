import { LoadSurveysController } from "../../../../../../presentation/controllers/survey/load-surveys/load-surveys-controller"
import { Controller } from "../../../../../../presentation/protocols"
import { makeLogControllerDecorator } from "../../../../decorators/log-controller-decorator-factory"
import { makeDbLoadSurvey } from "../../../../usecases/load-surveys/db-load-survey"

export const makeLoadSurveyController = (): Controller => {
    const controller = new LoadSurveysController(makeDbLoadSurvey())
    return makeLogControllerDecorator(controller)
}