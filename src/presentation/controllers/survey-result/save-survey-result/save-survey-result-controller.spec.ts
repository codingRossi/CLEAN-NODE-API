import { LoadSurveyById } from "@/domain/use-cases/load-survey-by-id"
import { SaveSurveyResultController } from "./save-survey-result"
import { forbidden, HttpRequest, SaveSurveyResult, SaveSurveyResultModel, serverError, SurveyModel, SurveyResultModel } from "./save-survey-result-protocols"
import { InvalidParamError } from "@/presentation/errors"
import MockDate from "mockdate"


const makeFakeRequest = (): HttpRequest => ({
    params: {
        surveyId: "surveyId"
    },
    body: {
        answer: "any_answer"
    },
    accountId: "any_account_id"
})

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

const makeFakeSurveyResult = (): SurveyResultModel => {
    return {
        id: "valid_id",
        surveyId: "valid_survey_id",
        accountId: "valid_account_id",
        date: new Date(),
        answer: "valid_answer",
    }
}

const makeLoadSurveyById = (): LoadSurveyById => {
    class LoadSurveyByIdStub implements LoadSurveyById {
        async loadById(id: string): Promise<SurveyModel> {
            return new Promise(resolve => resolve(makeFakeSurvey()))
        }
    }
    return new LoadSurveyByIdStub()
}

const makeSaveSurveyResult = (): SaveSurveyResult => {
    class SaveSurveyResultStub implements SaveSurveyResult {
        async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
            return new Promise(resolve => resolve(makeFakeSurveyResult()))
        }
    }
    return new SaveSurveyResultStub()
}

type SutTypes = {
    sut: SaveSurveyResultController,
    loadSurveyByIdStub: LoadSurveyById
    saveSurveyResultStub: SaveSurveyResult

}
const makeSut = (): SutTypes => {
    const loadSurveyByIdStub = makeLoadSurveyById()
    const saveSurveyResultStub = makeSaveSurveyResult()
    const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
    return {
        sut,
        loadSurveyByIdStub,
        saveSurveyResultStub
    }
}
describe("SaveSurveyResult Controller", () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })

    afterAll(() => {
        MockDate.reset()
    })

    test("Should call LoadSurveyById with correct values", async () => {
        const { sut, loadSurveyByIdStub } = makeSut()
        const loadById = jest.spyOn(loadSurveyByIdStub, "loadById")
        sut.handle(makeFakeRequest())
        expect(loadById).toHaveBeenCalledWith("any_survey_id")
    })

    test("Should return 403 if LoadSurveyById return null", async () => {
        const { sut, loadSurveyByIdStub } = makeSut()
        const httpResponse = jest.spyOn(loadSurveyByIdStub, "loadById").mockReturnValueOnce(new Promise(resolve => resolve(null)))
        sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(forbidden(new InvalidParamError("surveyId")))
    })

    test("Should return 500 if LoadSurveyById throws", async () => {
        const { sut, loadSurveyByIdStub } = makeSut()
        jest.spyOn(loadSurveyByIdStub, "loadById").mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const httpRequest = await sut.handle({})
        expect(httpRequest).toEqual(serverError(new Error()))
    })

    test("Should return 403 if an invalid awnser id provided", async () => {
        const { sut } = makeSut()
        const httpResponse = sut.handle({
            params: {
                surveyId: "surveyId"
            },
            body: {
                answer: "wrong_answer"
            }
        })
        expect(httpResponse).toEqual(forbidden(new InvalidParamError("answer")))
    })

    test("Should call SaveSurveyResult with correct values", async () => {
        const { sut, saveSurveyResultStub } = makeSut()
        const saveSpy = jest.spyOn(saveSurveyResultStub, "save")
        sut.handle(makeFakeRequest())
        expect(saveSpy).toHaveBeenCalledWith({
            surveyId: "any_survey_id",
            accountId: "any_account_id",
            date: new Date(),
            answer: "any_answer"
        })
    })
})