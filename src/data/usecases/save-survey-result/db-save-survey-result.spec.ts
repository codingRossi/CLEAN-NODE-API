
import { DbSaveSurveyResult, SaveSurveyResultModel, SaveSurveyResultRepository, SurveyResultModel } from "./db-save-survet-result-protocols"
import MockDate from "mockdate"

const makeFakeSurveyResultData = (): SaveSurveyResultModel => ({
    accountId: "any_account_id",
    answer: "any_answer",
    date: new Date(),
    surveyId: "any_survey_id"
})

const makeFakeSurveyResult = (): SurveyResultModel => Object.assign({}, makeFakeSurveyResultData(), {
    id: "any_id"
})

type SutTypes = {
    sut: DbSaveSurveyResult,
    saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
        async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
            return new Promise(resolve => resolve(makeFakeSurveyResult()))
        }
    }
    return new SaveSurveyResultRepositoryStub()
}
const makeSut = (): SutTypes => {
    const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository()
    const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
    return {
        sut,
        saveSurveyResultRepositoryStub
    }
}

describe("DbSaveSurveyResult UseCase", () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })

    afterAll(() => {
        MockDate.reset()
    })
    test("Should call SaveSurveyResultsRepository with correct values", async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(saveSurveyResultRepositoryStub, "save")
        const surveyResultData = makeFakeSurveyResultData()
        await sut.save(surveyResultData)
        expect(addSpy).toHaveBeenCalledWith(surveyResultData)
    })

    test("Should throw if SaveSurveyResultsRepository throws", async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSut()
        jest.spyOn(saveSurveyResultRepositoryStub, "save").mockRejectedValueOnce(new Error())
        const promise = sut.save(makeFakeSurveyResultData())
        await expect(promise).rejects.toThrow()
    })

    test("Should return SurveyResult on success", async () => {
        const { sut } = makeSut()
        const surveyResult = await sut.save(makeFakeSurveyResultData())
        expect(surveyResult).toEqual(makeFakeSurveyResult())
    })
})