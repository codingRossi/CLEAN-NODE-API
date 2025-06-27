import { SaveSurveyResultModel, SaveSurveyResultRepository, SurveyResultModel } from "@/data/usecases/save-survey-result/db-save-survet-result-protocols";
import { MongoHelper } from "../helpers/mongo-helper";

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
    async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
        const surveyResultCollection = await MongoHelper.getColletion('surveyResult')
        const res = await surveyResultCollection.findOneAndUpdate({
            surveyId: data.surveyId,
            accountId: data.accountId
        }, {
            $set: {
                answer: data.answer,
                data: data.date
            }
        }, {
            upsert: true,
            // returnDocument could make shit on mine code
            returnDocument: 'after'
        })

        return res.value && MongoHelper.map(res.value)
    }
}