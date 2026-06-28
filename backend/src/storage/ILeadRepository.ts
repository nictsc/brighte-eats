import { Lead, CreateLeadDto, ServiceType } from '../types'

export interface ILeadRepository {
  save(dto: CreateLeadDto): Lead
  findAll(filterService?: ServiceType): Lead[]
}
