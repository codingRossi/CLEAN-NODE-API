import { HttpRequest, httpResponse } from "../protocols/http";

export interface Controller {
    handle( httpRequest: HttpRequest): httpResponse
}