import { DbLoadSurveys, LoadSurveysRepository, SurveyModel } from "./db-load-survey-protocols"
import Mockdate from "mockdate"

const makeFakeSurveys = (): SurveyModel[] => {
    return [{
        id: "any_id",
        question: "any_question",
        answers: [{
            image: "any_image",
            answer: "any_answer"
        }],
        date: new Date()
    },
    {
        id: "other_id",
        question: "other_question",
        answers: [{
            image: "other_image",
            answer: "other_answer"
        }],
        date: new Date()
    }]
}

type SutTypes = {
    sut: DbLoadSurveys
    loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeLoadSurveyRepository = (): LoadSurveysRepository => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository {
        async loadAll(): Promise<SurveyModel[]> {
            return new Promise(resolve => resolve(makeFakeSurveys()))
        }
    }
    return new LoadSurveysRepositoryStub()

}

const makeSut = (): SutTypes => {
    const loadSurveysRepositoryStub = makeLoadSurveyRepository()
    const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
    return {
        sut,
        loadSurveysRepositoryStub
    }
}
describe("DbLoadSurveys", () => {
    beforeEach(() => {
        Mockdate.set(new Date())
    })

    afterAll(() => {
        Mockdate.reset()
    })
    test("Should call LoadSurveysRepository", async () => {
        const { sut, loadSurveysRepositoryStub } = makeSut()
        const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, "loadAll")
        await sut.load()
        expect(loadAllSpy).toHaveBeenCalled()
    })

    test("Should return a list of Surveys on success", async () => {
        const { sut } = makeSut()
        const surveys = await sut.load()
        expect(surveys).toEqual(makeFakeSurveys())
    })

    test("Should throw if LoadSurveyRepository throws", async () => {
        const { sut, loadSurveysRepositoryStub } = makeSut()
        jest.spyOn(loadSurveysRepositoryStub, "loadAll").mockRejectedValueOnce(new Promise(resolve => resolve(new Error())))
        const promise = await sut.load()
        await expect(promise).rejects.toThrow()
    })
})