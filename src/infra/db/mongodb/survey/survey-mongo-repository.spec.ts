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

    describe("add()", () => {
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

    describe("loadAll()", () => {
        test("Should load all surveys on success", async () => {
            await surveyColletion.insertMany(
                [{
                    question: "any_question",
                    answers: [{
                        answer: "any_question",
                        image: "any_image"
                    }],
                    date: new Date()
                },
                {
                    question: "other_question",
                    answers: [{
                        answer: "other_question",
                        image: "other_image"
                    }],
                    date: new Date()
                }]
            )
            const sut = makeSut()
            const surveys = await sut.loadAll()
            expect(surveys.length).toBe(2)
            expect(surveys[0]).toBe("any_question")
            expect(surveys[1]).toBe("other_question")
        })
    })
})