import { AddSurveyModel, AddSurveyRepository } from "./add-survey-protocols"
import { DbAddSurvey } from "./add-survey"
import MockDate from "mockdate"

const makeFakeSurveyData = (): AddSurveyModel => ({
    question: "any_question",
    answers: [{
        image: "any_image",
        answer: "any_answer"
    }],
    date: new Date()
})

interface SutTypes {
    sut: DbAddSurvey,
    addSurveyRepositoryStub: AddSurveyRepository
}

const makeAddSurveyRepository = (): AddSurveyRepository => {
    class AddSurveyRepositoryStub implements AddSurveyRepository {
        async add(surveyData: AddSurveyModel): Promise<void> {
            return new Promise(resolve => resolve())
        }
    }
    return new AddSurveyRepositoryStub()
}
const makeSut = (): SutTypes => {
    const addSurveyRepositoryStub = makeAddSurveyRepository()
    const sut = new DbAddSurvey(addSurveyRepositoryStub)
    return {
        sut,
        addSurveyRepositoryStub
    }
}

describe("DbAddSurvey UseCase", () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })

    beforeAll(() => {
        MockDate.reset()
    })
    test("Should call AddSurveyRepository with correct values", async () => {
        const { sut, addSurveyRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addSurveyRepositoryStub, "add")
        const surveyData = makeFakeSurveyData()
        await sut.add(surveyData)
        expect(addSpy).toHaveBeenCalledWith(surveyData)
    })

    test("Should throw if Hasher throws", async () => {
        const { sut, addSurveyRepositoryStub } = makeSut()
        jest.spyOn(addSurveyRepositoryStub, "add").mockRejectedValueOnce(new Error())
        const promise = sut.add(makeFakeSurveyData())
        await expect(promise).rejects.toThrow()
    })

})