// import axios from 'axios'
import request from 'supertest'
import app from '../../app'

jest.mock('axios')

const baseUrl = '/api/auth'

describe('Auth', () => {
	describe('POST /auth/signup', () => {
		const url = `${baseUrl}/signup`

		describe('Email Validation', () => {
			test('422 - when email is empty, api returns no value for email', async done => {
				const {
					status,
					body: { errors }
				} = await request(app).post(url).send({
					email: '',
					password: 'Pwd@1234'
				})

				expect(status).toEqual(422)
				expect(errors).toHaveLength(1)
				expect(errors[0].param).toEqual('email')
				expect(errors[0].value).toEqual('')
				done()
			})

			test('422 - when email is test, api returns invalid value', async done => {
				const {
					status,
					body: { errors }
				} = await request(app).post(url).send({
					email: 'test',
					password: 'Pwd@1234'
				})

				expect(status).toEqual(422)
				expect(errors).toHaveLength(1)
				expect(errors[0].param).toEqual('email')
				expect(errors[0].value).toEqual('test')
				done()
			})

			test('422 - when email is user@email, api returns error', async done => {
				const {
					status,
					body: { errors }
				} = await request(app).post(url).send({
					email: 'user@email',
					password: 'Pwd@1234'
				})

				expect(status).toEqual(422)
				expect(errors).toHaveLength(1)
				expect(errors[0].param).toEqual('email')
				expect(errors[0].value).toEqual('user@email')
				done()
			})

			test('200 - when email is user@email.com, no validation error is processed', async done => {
				const { status } = await request(app).post(url).send({
					email: 'user@email.com',
					password: 'Pwd@1234'
				})

				expect(status).toEqual(200)
				done()
			})

			test('409 - when email is u1@e.com, it fails to create user as it already exists in db', async done => {
				const { status, body } = await request(app).post(url).send({
					email: 'u1@e.com',
					password: 'Pwd@1234'
				})

				expect(status).toEqual(409)
				expect(body.status).toEqual('error')
				expect(body.message).toEqual('User with credentials already exist')
				done()
			})
		})

		describe('Password Validation', () => {
			test('422 - when password is empty, api returns error for missing password value', async done => {
				const {
					status,
					body: { errors }
				} = await request(app).post(url).send({
					email: 'user@email.com',
					password: ''
				})

				expect(status).toEqual(422)
				expect(errors).toHaveLength(1)
				expect(errors[0].param).toEqual('password')
				expect(errors[0].value).toEqual('')
				done()
			})

			test('422 - when password is test, api returns error as password lacks following - an uppercase letter, a numeric, a special character & len < 8', async done => {
				const {
					status,
					body: { errors }
				} = await request(app).post(url).send({
					email: 'user@email.com',
					password: 'test'
				})

				expect(status).toEqual(422)
				expect(errors).toHaveLength(1)
				expect(errors[0].param).toEqual('password')
				expect(errors[0].value).toEqual('test')
				done()
			})

			test('422 - when password is Test@, api returns error as password lacks following - a numeric & len < 8', async done => {
				const {
					status,
					body: { errors }
				} = await request(app).post(url).send({
					email: 'user@email.com',
					password: 'Test@'
				})

				expect(status).toEqual(422)
				expect(errors).toHaveLength(1)
				expect(errors[0].param).toEqual('password')
				expect(errors[0].value).toEqual('Test@')
				done()
			})

			test('422 - when password is Pwd@12, api returns error as password len < 8', async done => {
				const {
					status,
					body: { errors }
				} = await request(app).post(url).send({
					email: 'user@email.com',
					password: 'Pwd@12'
				})

				expect(status).toEqual(422)
				expect(errors).toHaveLength(1)
				expect(errors[0].param).toEqual('password')
				expect(errors[0].value).toEqual('Pwd@12')
				done()
			})

			test('200 - when password is Pwd@1234, api returns no validation error for password', async done => {
				const { status } = await request(app).post(url).send({
					email: 'u7@e.com',
					password: 'Pwd@1234'
				})

				expect(status).toEqual(200)
				done()
			})
		})

		describe('Multiple Fields Validation', () => {
			test('422 - when body is missing, api returns validation error for both email & password', async done => {
				const {
					status,
					body: { errors }
				} = await request(app).post(url)

				expect(status).toEqual(422)
				expect(errors).toHaveLength(2)
				expect(errors[0].param).toEqual('email')
				expect(errors[1].param).toEqual('password')
				done()
			})

			test('422 - when body parameters has empty string values, api returns validation errors for email & password', async done => {
				const {
					status,
					body: { errors }
				} = await request(app).post(url).send({
					email: '',
					password: ''
				})

				expect(status).toEqual(422)
				expect(errors).toHaveLength(2)
				expect(errors[0].param).toEqual('email')
				expect(errors[1].param).toEqual('password')
				done()
			})
		})
	})
})
