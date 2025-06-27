import { Collection } from "mongodb"
import { MongoHelper } from "../helpers/mongo-helper"
import { SurveyResultMongoRepository } from "./survey-result-mongo-repository"
import { SurveyModel } from "@/domain/models/survey"
import { AccountModel } from "@/domain/models/account"

let surveyColletion: Collection
let surveyResultColletion: Collection
let accountColletion: Collection

const makeSurvey = async (): Promise<SurveyModel> => {
    const res = await surveyColletion.insertOne({
        question: "any_question",
        answers: [{
            answer: "any_question",
            image: "any_image"
        }, {
            answer: "other_answer",
        }],
        date: new Date()
    })
    return res.acknowledged[0]
}

const makeAccount = async (): Promise<AccountModel> => {
    const res = await accountColletion.insertOne({
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password"
    })
    return res.acknowledged[0]
}

const makeSut = (): SurveyResultMongoRepository => {
    return new SurveyResultMongoRepository()
}

describe("save()", () => {
    beforeAll(async () => {
        surveyColletion = await MongoHelper.getColletion('surveys')
        surveyResultColletion = await MongoHelper.getColletion('surveyResult')
        accountColletion = await MongoHelper.getColletion('accounts')
        await MongoHelper.connect(process.env.MONGO_URL!)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        await surveyColletion.deleteMany({})
        await surveyResultColletion.deleteMany({})
        await accountColletion.deleteMany({})
    })

    test("Should a survey result if its new", async () => {
        const survey = await makeSurvey()
        const account = await makeAccount()
        const sut = makeSut()
        const surveyResult = await sut.save({
            surveyId: survey.id,
            accountId: account.id,
            answer: survey.answers[0].answer,
            date: new Date()
        })
        expect(surveyResult).toBeTruthy()
        expect(surveyResult.id).toBeTruthy()
        expect(surveyResult.answer).toBe(survey.answers[0].answer)

    })
})