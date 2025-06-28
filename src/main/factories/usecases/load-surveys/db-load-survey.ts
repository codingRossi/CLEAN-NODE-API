import { DbLoadSurveys, LoadSurveys, SurveyMongoRepository } from "./db-load-surveys-protocols"

export const makeDbLoadSurvey = (): LoadSurveys => {
    const surveyMongoRepository = new SurveyMongoRepository()
    return new DbLoadSurveys(surveyMongoRepository)
}