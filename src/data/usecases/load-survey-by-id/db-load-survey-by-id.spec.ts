import { SurveyModel } from "@/domain/models/survey"
import { LoadSurveyByIdRepository } from "@/data/protocols/db/survey/load-survey-by-id-repository"
import Mockdate from "mockdate"
import { DbLoadSurveyById } from "./db-load-survey-by-id"

const makeFakeSurvey = (): SurveyModel => {
    return {
        id: "any_id",
        question: "any_question",
        answers: [{
            image: "any_image",
            answer: "any_answer"
        }],
        date: new Date()
    }
}

type SutTypes = {
    sut: DbLoadSurveyById
    loadSurveysByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
    class LoadSurveysByIdRepositoryStub implements LoadSurveyByIdRepository {
        async loadById(): Promise<SurveyModel> {
            return new Promise(resolve => resolve(makeFakeSurvey()))
        }
    }
    return new LoadSurveysByIdRepositoryStub()

}

const makeSut = (): SutTypes => {
    const loadSurveysByIdRepositoryStub = makeLoadSurveyByIdRepository()
    const sut = new DbLoadSurveyById(loadSurveysByIdRepositoryStub)
    return {
        sut,
        loadSurveysByIdRepositoryStub
    }
}

describe("DbLoadSurveysById", () => {
    beforeEach(() => {
        Mockdate.set(new Date())
    })

    afterAll(() => {
        Mockdate.reset()
    })
    test("Should call LoadSurveysByIdRepository", async () => {
        const { sut, loadSurveysByIdRepositoryStub } = makeSut()
        const loadByIdSpy = jest.spyOn(loadSurveysByIdRepositoryStub, "loadById")
        await sut.loadById("any_id")
        expect(loadByIdSpy).toHaveBeenCalledWith("any_id")
    })

    test("Should return Survey on success", async () => {
        const { sut } = makeSut()
        const survey = await sut.loadById("any_id")
        expect(survey).toEqual(makeFakeSurvey())
    })

    test("Should throw if LoadSurveysByIdRepository throws", async () => {
        const { sut, loadSurveysByIdRepositoryStub } = makeSut()
        jest.spyOn(loadSurveysByIdRepositoryStub, "loadById").mockRejectedValueOnce(new Promise(resolve => resolve(new Error())))
        const promise = await sut.loadById("any_id")
        await expect(promise).rejects.toThrow()
    })
})