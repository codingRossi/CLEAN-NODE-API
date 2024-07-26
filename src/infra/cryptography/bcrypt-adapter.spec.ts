import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

describe('Bcrypt Adapter', () => {
    test('Should call bcrypt with correct values', async () => {
        const salt = 12
        const sut = new BcryptAdapter(salt)
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.encrypt('any_value')
        expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('Should return a hash on sucess', async () => {
        const salt = 12
        const sut = new BcryptAdapter(salt)
        const hash = await sut.encrypt('any_value')
        expect(hash).toBe('any_value')
    })
})