import request from "supertest"
import app from "../config/app"

describe("Content type Middleware", () => {
  test("Should return as default content type as json", async () => {
    app.post("/test_content_type", (req, res) => {
      res.send("")
    })
    await request(app)
      .get('/test_content_type')
      .expect("content-type", /json/)
  })
})