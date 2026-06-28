import { Lead, ServiceType } from './types'

const BASE = '/leads'

export async function createLead(data: {
  name: string
  email: string
  mobile: string
  postcode: string
  services: ServiceType[]
}): Promise<Lead> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.errors?.join(', ') ?? 'Failed to create lead')
  return json
}

export async function fetchLeads(): Promise<Lead[]> {
  const res = await fetch(BASE)
  if (!res.ok) throw new Error('Failed to fetch leads')
  return res.json()
}
