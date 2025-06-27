import { SaveSurveyResultModel } from "@/domain/use-cases/save-survey-result";
import { AddSurveyModel } from "../../../../domain/use-cases/add-survey";
import { SurveyResultModel } from "@/domain/models/survey-result";

export interface SaveSurveyResultRepository {
    save(data: SaveSurveyResultModel): Promise<SurveyResultModel>
}