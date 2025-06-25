import { Collection } from "mongodb"
import { MongoHelper } from "../helpers/mongo-helper"
import { AccountMongoRepository } from "./account-mongo-repository"
let accountColletion: Collection

describe("Account Mongo Repository", () => {
  beforeAll(async () => {
    accountColletion = await MongoHelper.getColletion('accounts')
    await MongoHelper.connect(process.env.MONGO_URL!)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await accountColletion.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  describe("updateAccessToken", () => {
    test("Should return an account on add success", async () => {

      const sut = makeSut()
      const account = await sut.add({
        name: "any_name",
        email: "any_mail@mail.com",
        password: "any_password"
      })
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe("any_name")
      expect(account.email).toBe("any_mail@mail.com")
      expect(account.password).toBe("any_password")
    })

    test("Should return an account on loadByEmail success", async () => {
      const sut = makeSut()
      await accountColletion.insertOne({
        name: "any_name",
        email: "any_mail@mail.com",
        password: "any_password"
      })
      const account = await sut.loadByEmail("any_mail@mail.com")
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe("any_name")
      expect(account.email).toBe("any_mail@mail.com")
      expect(account.password).toBe("any_password")
    })

    test("Should return null if loadByEmail fails", async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail("any_mail@mail.com")
      expect(account).toBeFalsy()
    })
  })

  describe("loadByToken", () => {
    test("Should return an account on loadByToken without role", async () => {
      const sut = makeSut()
      await accountColletion.insertOne({
        name: "any_name",
        email: "any_mail@mail.com",
        password: "any_password",
        accessToken: "any_token"
      })
      const account = await sut.loadByToken("any_token")
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe("any_name")
      expect(account.email).toBe("any_mail@mail.com")
      expect(account.password).toBe("any_password")
    })

    test("Should return an account on loadByToken with role", async () => {
      const sut = makeSut()
      await accountColletion.insertOne({
        name: "any_name",
        email: "any_mail@mail.com",
        password: "any_password",
        accessToken: "any_token",
        role: "any_role"
      })
      const account = await sut.loadByToken("any_token", "any_role")
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe("any_name")
      expect(account.email).toBe("any_mail@mail.com")
      expect(account.password).toBe("any_password")
    })

    test("Should return null if loadByToken fails", async () => {
      const sut = makeSut()
      const account = await sut.loadByToken("any_token")
      expect(account).toBeFalsy()
    })

  })
})