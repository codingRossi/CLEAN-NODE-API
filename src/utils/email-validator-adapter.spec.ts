import { EmailValidatorAdapter } from "./email-validator"

describe('EmailValidator Adapter', () => {
    test('Should return faLse if validator returns false', () => {
        const sut = new EmailValidatorAdapter()
        const isValid = sut.isValid('invalid_email@mail.com')
        expect(isValid).toBe(false)
    })
})