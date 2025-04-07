import { Express } from "express"
import { bodyParser } from "../middlwares/body-parser"
import { cors } from "../middlwares/cors"

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
}