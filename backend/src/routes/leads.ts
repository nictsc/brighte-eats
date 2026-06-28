import { Router, Request, Response } from 'express'
import { ILeadRepository } from '../storage/ILeadRepository'
import { validateCreateLead } from '../validation/leadValidator'
import { VALID_SERVICES, ServiceType } from '../types'

export function createLeadsRouter(repository: ILeadRepository): Router {
  const router = Router()

  router.post('/', (req: Request, res: Response) => {
    const result = validateCreateLead(req.body)
    if (!result.valid) {
      return res.status(400).json({ errors: result.errors })
    }
    const lead = repository.save(req.body)
    return res.status(201).json(lead)
  })

  router.get('/', (req: Request, res: Response) => {
    const serviceParam = req.query.service as string | undefined
    const filterService =
      serviceParam && (VALID_SERVICES as readonly string[]).includes(serviceParam)
        ? (serviceParam as ServiceType)
        : undefined
    return res.status(200).json(repository.findAll(filterService))
  })

  return router
}
