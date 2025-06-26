import { AddSurveyRepository } from "../../../../data/protocols/db/survey/add-survey-repository";
import { LoadSurveysRepository } from "../../../../data/protocols/db/survey/load-survey-repository";
import { SurveyModel } from "../../../../domain/models/survey";
import { AddSurveyModel } from "../../../../domain/use-cases/add-survey";
import { MongoHelper } from "../helpers/mongo-helper";

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getColletion('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getColletion('surveys')
    const surveys = await surveyCollection.find().toArray()
    return surveys.map((survey: any) => ({
      id: survey._id.toString(),
      question: survey.question,
      answers: survey.answers,
      date: survey.date
    }))
  }
}