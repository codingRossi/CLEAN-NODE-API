import { Collection } from "mongodb"
import { MongoHelper } from "../helpers/mongo-helper"
import { LogMongoRepository } from "./log-mongo-repository"

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}
describe("Log Mongo Repository", () => {
  let errorColletion: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorColletion = await MongoHelper.getColletion('errors')
    await errorColletion.deleteMany({})
  })

  test("Should ceate an error log on success", async () => {
    const sut = makeSut()
    await sut.logError("any_error")
    const count = await errorColletion.countDocuments()
    expect(count).toBe(1)
  })
})