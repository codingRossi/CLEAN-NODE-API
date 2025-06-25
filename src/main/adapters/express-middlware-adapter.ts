import { Controller, HttpRequest, Middleware } from "../../presentation/protocols";
import { NextFunction, Request, Response } from "express"

export const adaptMiddlware = (middlware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: req.headers
    }
    const httpResponse = await middlware.handle(httpRequest)
    if (httpResponse.statusCode >= 200) {
      Object.assign(req, httpResponse.body)
      next()
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
} 