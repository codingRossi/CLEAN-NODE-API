import { AddSurvey, DbAddSurvey, SurveyMongoRepository } from "./db-add-survey-factory-protocols"

export const makeDbAddSurvey = (): AddSurvey => {
    const surveyMongoRepository = new SurveyMongoRepository()
    return new DbAddSurvey(surveyMongoRepository)
}