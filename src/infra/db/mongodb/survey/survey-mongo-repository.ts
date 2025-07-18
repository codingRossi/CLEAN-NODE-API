import { LoadSurveyByIdRepository } from "@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols";
import { AddSurveyRepository } from "../../../../data/protocols/db/survey/add-survey-repository";
import { LoadSurveysRepository } from "../../../../data/protocols/db/survey/load-survey-repository";
import { SurveyModel } from "../../../../domain/models/survey";
import { AddSurveyModel } from "../../../../domain/use-cases/add-survey";
import { MongoHelper } from "../helpers/mongo-helper";

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getColletion('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getColletion('surveys')
    const surveys = await surveyCollection.find().toArray()
    return MongoHelper.mapCollection(surveys)

  }

  async loadById(id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getColletion('surveys')
    const { ObjectId } = require('mongodb')
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })
    return survey && MongoHelper.map(survey)
  }
}