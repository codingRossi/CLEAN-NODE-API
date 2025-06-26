import { SurveyModel } from "../../../../domain/models/survey";
import { AddSurveyModel } from "../../../../domain/use-cases/add-survey";

export interface LoadSurveysRepository {
    loadAll(): Promise<SurveyModel[]>
}