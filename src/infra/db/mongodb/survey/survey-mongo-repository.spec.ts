import { Collection } from "mongodb"
import { MongoHelper } from "../helpers/mongo-helper"
import { SurveyMongoRepository } from "./survey-mongo-repository"

let surveyColletion: Collection

describe("Survey Mongo Repository", () => {
    beforeAll(async () => {
        surveyColletion = await MongoHelper.getColletion('survey')
        await MongoHelper.connect(process.env.MONGO_URL!)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        await surveyColletion.deleteMany({})
    })

    const makeSut = (): SurveyMongoRepository => {
        return new SurveyMongoRepository()
    }

    test("Should add a survey on success", async () => {
        const sut = makeSut()
        await sut.add({
            question: "any_question",
            answers: [{
                answer: "any_question",
                image: "any_image"
            }, {
                answer: "other_answer",
            }],
            date: new Date()
        })

        const survey = await surveyColletion.findOne({ question: "any_question" })
        expect(survey).toBeTruthy()
    })
})