import bcrypt from "bcrypt"
import { BcryptAdapter } from "./bcrypt-adapter"

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve("hash"))
  },

  async compare(): Promise<boolean> {
    return new Promise(resolve => resolve(true))
  }
}))

const salt = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}
describe("Bcrypt Adapter", () => {
  test("Should calls hash with correct values", async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, "hash")
    await sut.hash("any_value")
    expect(hashSpy).toHaveBeenCalledWith("any_value", salt)
  })

  test("Should return a hvalid hash on hash success", async () => {
    const sut = makeSut()
    const hash = await sut.hash("any_value")
    expect(hash).toBe("hash")
  })

  test("Should throws if bcrypt throws", async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, "hash").mockImplementationOnce(() => Promise.reject(new Error("Erro simulado")));
    const promise = sut.hash("any_value")
    await expect(promise).rejects.toThrow()
  })

  test("Should calls compare with correct values", async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, "compare")
    await sut.compare("any_value", "any_hash")
    expect(compareSpy).toHaveBeenCalledWith("any_value", "any_hash")
  })

  test("Should return true when compare succeeds", async () => {
    const sut = makeSut()
    const isValid = await sut.hash("any_value")
    expect(isValid).toHaveBeenCalledWith("any_value", salt)
  })

  test("Should throws if compare throws", async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, "compare").mockImplementationOnce(() => Promise.reject(new Error("Erro simulado")));
    const promise = sut.compare("any_value", "any_hash")
    await expect(promise).rejects.toThrow()
  })
})  