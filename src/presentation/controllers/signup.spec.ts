import { SignUpController } from "./signup"
import { MissingParamError, InvalidParamError, ServerError } from "../errors"
import { AddAccountModel, AddAccount, EmailValidator, AccountModel } from "./signup/signup-protocols"

interface SutTypes {
    sut: SignUpController
    emailValidatorStub: EmailValidator
    addAccountStub: AddAccount
}

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator{
        isValid (email: string): boolean {
            return true
        }
}
return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        add (account: AddAccountModel): AccountModel {
            const fakeAccount = {
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_@mail.com',
                password: 'valid_password'
            }
            return fakeAccount
        }
}
return new AddAccountStub()
}

const makeEmailValidatorWithError = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator{
        isValid (email: string): boolean {
            throw new Error()
        }
}
return new EmailValidatorStub()
}


const makeSut = (): SutTypes => {
   const emailValidatorStub = makeEmailValidator()
   const addAccountStub = makeAddAccount()
    const sut = new SignUpController(emailValidatorStub, addAccountStub)
    return {
        sut,
        emailValidatorStub,
        addAccountStub
    }
}

describe('SignUp Controller', () => {
    test('Should return 400 if no name is provided', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: 'any_@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
       const httpResponse = sut.handle(httpRequest)  
       expect(httpResponse.statusCode).toBe(400)    
       expect(httpResponse.body).toEqual(new MissingParamError('name'))    //controla a requisição
    })

    test('Should return 400 if no Email is provided', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
       const httpResponse = sut.handle(httpRequest)  
       expect(httpResponse.statusCode).toBe(400)    
       expect(httpResponse.body).toEqual(new MissingParamError('email'))    //controla a requisição
    })

    test('Should return 400 if no password is provided', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_@mail.com',
                passwordConfirmation: 'any_password'
            }
        }
       const httpResponse = sut.handle(httpRequest)  
       expect(httpResponse.statusCode).toBe(400)    
       expect(httpResponse.body).toEqual(new MissingParamError('password'))    //controla a requisição
    })

    test('Should return 400 if no password confirmation is provided', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                email: "any_@mail.com",
                password: 'any_password',
            }
        }
       const httpResponse = sut.handle(httpRequest)  
       expect(httpResponse.statusCode).toBe(400)    
       expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))    //controla a requisição
    })

    test('Should return 400 if password confirmation fails', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                email: "any_@mail.com",
                password: 'any_password',
                passwordConfirmation: 'invalid_password'
            }
        }
       const httpResponse = sut.handle(httpRequest)  
       expect(httpResponse.statusCode).toBe(400)    
       expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))    //controla a requisição
    })


    test('Should return 400 if an invalid email is provided', () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpRequest = {
            body: {
                name: 'any_name',
                email: "invalid_@mail.com",
                password: 'any_password',
                passwordConfirmation: 'any_password'
                
            }
        }
       const httpResponse = sut.handle(httpRequest)  
       expect(httpResponse.statusCode).toBe(400)    
       expect(httpResponse.body).toEqual(new InvalidParamError('email'))    //controla a requisição
    })

    test('Should call EmailValidator with correct email', () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        const httpRequest = {
            body: {
                name: 'any_name',
                email: "any_@mail.com",
                password: 'any_password',
                passwordConfirmation: 'any_password'
                
            }
        }
        sut.handle(httpRequest)
       expect(isValidSpy).toHaveBeenCalledWith('any_@mail.com')    
    })

    test('Should return 500 if EmailValidator Throws', () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error
        })
        const httpRequest = {
            body: {
                name: 'any_name',
                email: "any_@mail.com",
                password: 'any_password',
                passwordConfirmation: 'any_password'
                
            }
        }
       const httpResponse = sut.handle(httpRequest)  
       expect(httpResponse.statusCode).toBe(500)    
       expect(httpResponse.body).toEqual(new ServerError())    //controla a requisição
    })

    test('Should return 500 if EmailValidator Throws', () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })
        const httpRequest = {
            body: {
                name: 'any_name',
                email: "any_@mail.com",
                password: 'any_password',
                passwordConfirmation: 'any_password'
                
            }
        }
       const httpResponse = sut.handle(httpRequest)  
       expect(httpResponse.statusCode).toBe(500)    
       expect(httpResponse.body).toEqual(new ServerError())    //controla a requisição
    })

    test('Should call AddAccount with correct values', () => {
        const { sut, addAccountStub } = makeSut()
        const addSpy = jest.spyOn(addAccountStub, 'add')
        const httpRequest = {
            body: {
                name: 'any_name',
                email: "any_@mail.com",
                password: 'any_password',
                passwordConfirmation: 'any_password'
                
            }
        }
        sut.handle(httpRequest)
       expect(addSpy).toHaveBeenCalledWith({
            name: 'any_name',
            email: "any_@mail.com",
            password: 'any_password',
       })    
    })

    test('Should return 200 if valid data is provided is provided', () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'valid_name',
                email: "valid_@mail.com",
                password: 'valid_password',
                passwordConfirmation: 'valid_password'
                
            }
        }
       const httpResponse = sut.handle(httpRequest)  
       expect(httpResponse.statusCode).toBe(200)    
       expect(httpResponse.body).toEqual({
            id: 'valid_id',
            name: 'valid_name',
            email: "valid_@mail.com",
            password: 'valid_password',
       })    //controla a requisição
    })
})