import { AddSurvey, AddSurveyModel } from "./add-survey-protocols"
import { AddSurveyRepository } from "./add-survey-protocols";

export class DbAddSurvey implements AddSurvey {
    constructor(private readonly addSurveyRepository: AddSurveyRepository) { }
    async add(data: AddSurveyModel): Promise<void> {
        await this.addSurveyRepository.add(data)
    }
}