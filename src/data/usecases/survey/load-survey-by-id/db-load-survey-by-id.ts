import { LoadSurveyById } from "@/domain/use-cases/load-survey-by-id"
import { LoadSurveyByIdRepository, SurveyModel } from "./db-load-survey-by-id-protocols"

export class DbLoadSurveyById implements LoadSurveyById {
    constructor(private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) { }

    async loadById(id: string): Promise<SurveyModel> {
        const survey = await this.loadSurveyByIdRepository.loadById(id)
        return survey
    }
}