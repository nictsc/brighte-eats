import express from 'express'
import cors from 'cors'
import { InMemoryLeadRepository } from './storage/InMemoryLeadRepository'
import { createLeadsRouter } from './routes/leads'

const repository = new InMemoryLeadRepository()
const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())
app.use('/leads', createLeadsRouter(repository))

export { app, repository }
export default app
