import { Lead } from './types'

// In-memory store — data resets on server restart.
// In production this would be a database (see README).
const leads: Lead[] = []

export function getAllLeads(): Lead[] {
  return leads
}

export function addLead(lead: Lead): Lead {
  leads.push(lead)
  return lead
}

export function clearLeads(): void {
  leads.length = 0
}
