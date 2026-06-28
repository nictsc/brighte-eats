export type ServiceType = 'delivery' | 'pickup' | 'payment'

export interface Lead {
  id: string
  name: string
  email: string
  mobile: string
  postcode: string
  services: ServiceType[]
  createdAt: string
}
