import request from 'supertest'
import app, { repository } from '../app'
import { CreateLeadDto } from '../types'

beforeEach(() => (repository as any).clear())

const validLead: CreateLeadDto = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  mobile: '0412345678',
  postcode: '2000',
  services: ['delivery']
}

it('POST /leads saves and returns a lead on the happy path', async () => {
  const res = await request(app).post('/leads').send(validLead)
  expect(res.status).toBe(201)
  expect(res.body.id).toBeDefined()
  expect(res.body.createdAt).toBeDefined()
  expect(res.body).toMatchObject({
    name: 'Jane Smith',
    email: 'jane@example.com',
    services: ['delivery']
  })
})

it('GET /leads returns the leads that were created', async () => {
  await request(app).post('/leads').send(validLead)
  await request(app).post('/leads').send({ ...validLead, email: 'bob@example.com' })

  const res = await request(app).get('/leads')
  expect(res.status).toBe(200)
  expect(res.body).toHaveLength(2)
})
