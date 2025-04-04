import { MissingParamError } from "../errors/missingParamError"
import { HttpResponse } from "../protocols/http"

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})