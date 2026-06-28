import { randomUUID } from 'crypto'
import { ILeadRepository } from './ILeadRepository'
import { Lead, CreateLeadDto, ServiceType } from '../types'

export class InMemoryLeadRepository implements ILeadRepository {
  private leads: Lead[] = []

  save(dto: CreateLeadDto): Lead {
    const lead: Lead = {
      id: randomUUID(),
      name: dto.name.trim(),
      email: dto.email.toLowerCase(),
      mobile: dto.mobile.trim(),
      postcode: dto.postcode.trim(),
      services: dto.services,
      createdAt: new Date().toISOString()
    }
    this.leads.push(lead)
    return lead
  }

  findAll(filterService?: ServiceType): Lead[] {
    if (!filterService) {
      return [...this.leads]
    }
    return this.leads.filter((lead) => lead.services.includes(filterService))
  }

  clear(): void {
    this.leads = []
  }
}
