import { MissingParamError } from "../errors/missingParamError"
import { HttpResponse } from "../protocols/http"

export const badRequest = (error: Error): HttpResponse => {
  return {
    statusCode: 400,
    body: error
  }
}