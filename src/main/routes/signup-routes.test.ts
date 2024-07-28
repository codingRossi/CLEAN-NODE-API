import request from "supertest"
import express from 'express'
import setupMiddlewares from '../config/middlewares'
import setupRoutes from '../config/routes'

describe('SignUp Routes', () => {
    const app = express()
    setupMiddlewares(app)
    setupRoutes(app)
    
    test('Should return an account on success', async () => {
        await request(app)
            .post('/api/signup')
            .send({
                name: 'Rodrigo',
                email: 'rodrigo.manguinho@gmail.com',
                password: '123',
                passwordConfirmation: '123',
            })
            .expect(200)
    })
})