import { useEffect, useState } from 'react'
import { fetchLeads } from '../api'
import { Lead } from '../types'

export default function LeadsList() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchLeads()
      .then(setLeads)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="state-message">Loading leads...</p>
  if (error) return <p className="state-message error">Failed to load leads.</p>
  if (leads.length === 0) return <p className="state-message">No leads yet. Be the first to register!</p>

  return (
    <div>
      <h2>Registered Leads</h2>
      <div className="table-wrapper">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Postcode</th>
              <th>Services</th>
              <th>Date Registered</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.mobile}</td>
                <td>{lead.postcode}</td>
                <td>
                  <span className="services">
                    {lead.services.map((s) => (
                      <span key={s} className="badge">{s}</span>
                    ))}
                  </span>
                </td>
                <td>{new Date(lead.createdAt).toLocaleDateString('en-AU', {
                  day: '2-digit', month: 'short', year: 'numeric'
                })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
