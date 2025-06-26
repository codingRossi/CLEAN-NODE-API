import { DbLoadSurveys } from "../../../../data/usecases/load-surveys/db-load-survey"
import { LoadSurveys } from "../../../../domain/use-cases/load-surveys"
import { SurveyMongoRepository } from "../../../../infra/db/mongodb/survey/survey-mongo-repository"

export const makeDbLoadSurvey = (): LoadSurveys => {
    const surveyMongoRepository = new SurveyMongoRepository()
    return new DbLoadSurveys(surveyMongoRepository)
}