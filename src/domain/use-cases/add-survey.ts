import { AccountModel } from "../models/account"

export interface AddSurveyModel {
  questions: string
  answers: SurveyAnswer[]
}

export interface SurveyAnswer {
  image: string
  answer: string
}

export interface AddSurvey {
  add(data: AddSurveyModel): Promise<void>
}

