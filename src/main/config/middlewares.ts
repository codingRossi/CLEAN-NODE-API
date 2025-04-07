import { Express } from "express"
import { bodyParser } from "../middlwares/body-parser"
import { cors } from "../middlwares/cors"
import { contentType } from "../middlwares/content-type"

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
}