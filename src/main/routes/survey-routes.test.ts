import request from "supertest"
import app from "../config/app"
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper"

describe("POST /surveys", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL!)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const surveyColletion = await MongoHelper.getColletion('survey')
    await surveyColletion.deleteMany({})
  })
  test("Should return 403 on add survey without accessToken", async () => {
    await request(app)
      .post('/api/surveys')
      .send({
        question: "Question",
        answers: [{
          answer: "Answer 1",
          image: "http://image-name.com"
        }, {
          answer: "Answer 2"
        }],
      })
      .expect(403)
  })
})