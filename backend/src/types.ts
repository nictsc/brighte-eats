export type ServiceType = 'delivery' | 'pickup' | 'payment'
export const VALID_SERVICES: readonly ServiceType[] = ['delivery', 'pickup', 'payment']

export interface Lead {
  id: string
  name: string
  email: string
  mobile: string
  postcode: string
  services: ServiceType[]
  createdAt: string
}

export interface CreateLeadDto {
  name: string
  email: string
  mobile: string
  postcode: string
  services: ServiceType[]
}

// Keep backward compat alias used by existing routes/leads.ts
export type CreateLeadBody = CreateLeadDto

export interface ValidationResult {
  valid: boolean
  errors: string[]
}
