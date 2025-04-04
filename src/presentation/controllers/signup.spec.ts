import { SignUpController } from "./signup"

describe("Signup Controller", () => {
  test("Should return 400 if no name is provided", () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        password: "any_passoword",
        passwordValidation: "any_password"
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  test("Should return 400 if no name is provided", () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        password: "any_passoword",
        passwordValidation: "any_password"
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error("Missing param: name"))
  })
})