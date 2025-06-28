import { LoadSurveyById } from "@/domain/use-cases/load-survey-by-id"
import { SaveSurveyResultController } from "./save-survey-result"
import { forbidden, HttpRequest, serverError, SurveyModel } from "./save-survey-result-protocols"
import { InvalidParamError } from "@/presentation/errors"

const makeFakeRequest = (): HttpRequest => ({
    params: {
        surveyId: "surveyId"
    },
    body: {
        answer: "any_answer"
    }
})

const makeLoadSurveyById = (): LoadSurveyById => {
    class LoadSurveyByIdStub implements LoadSurveyById {
        async loadById(id: string): Promise<SurveyModel> {
            return null
        }
    }
    return new LoadSurveyByIdStub()
}

type SutTypes = {
    sut: SaveSurveyResultController,
    loadSurveyByIdStub: LoadSurveyById

}
const makeSut = (): SutTypes => {
    const loadSurveyByIdStub = makeLoadSurveyById()
    const sut = new SaveSurveyResultController(loadSurveyByIdStub)
    return {
        sut,
        loadSurveyByIdStub
    }
}
describe("SaveSurveyResult Controller", () => {
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
})