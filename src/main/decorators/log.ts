import { LogErrorRepository } from "../../data/protocols/log-error-repository"
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"

export class LogControllerDecorator implements Controller {
  private readonly logErrorRepository: LogErrorRepository
  private readonly controller: Controller

  constructor(controller: Controller, logErrorRepository: LogErrorRepository) {
    this.controller = controller
    this.logErrorRepository = logErrorRepository
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack)
    }
    return httpResponse
  }
}