import React, { useState } from 'react'
import { createLead } from '../api'
import { ServiceType } from '../types'

const SERVICES: ServiceType[] = ['delivery', 'pickup', 'payment']

function isValidAustralianPostcode(postcode: string): boolean {
  const n = parseInt(postcode, 10)
  return (n >= 200 && n <= 299) || (n >= 800 && n <= 999) || (n >= 1000 && n <= 9999)
}

interface Props {
  onSuccess: () => void
}

interface FormErrors {
  name?: string
  email?: string
  mobile?: string
  postcode?: string
  services?: string
}

function validate(fields: {
  name: string
  email: string
  mobile: string
  postcode: string
  services: ServiceType[]
}): FormErrors {
  const errors: FormErrors = {}
  if (!fields.name.trim()) errors.name = 'Name is required'
  if (!fields.email.trim()) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errors.email = 'Enter a valid email'
  if (!fields.mobile.trim()) errors.mobile = 'Mobile is required'
  else if (!/^04\d{8}$/.test(fields.mobile)) errors.mobile = 'Mobile must be a 10-digit Australian mobile starting with 04'
  if (!fields.postcode.trim()) errors.postcode = 'Postcode is required'
  else if (!/^\d{4}$/.test(fields.postcode)) errors.postcode = 'Enter a 4-digit postcode'
  else if (!isValidAustralianPostcode(fields.postcode)) errors.postcode = 'Enter a valid Australian postcode'
  if (fields.services.length === 0) errors.services = 'Select at least one service'
  return errors
}

export default function RegistrationForm({ onSuccess }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [postcode, setPostcode] = useState('')
  const [services, setServices] = useState<ServiceType[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState('')

  function toggleService(s: ServiceType) {
    setServices((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError('')
    setSuccess(false)

    const fieldErrors = validate({ name, email, mobile, postcode, services })
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setLoading(true)

    try {
      await createLead({ name, email, mobile, postcode, services })
      setSuccess(true)
      setName(''); setEmail(''); setMobile(''); setPostcode(''); setServices([])
      onSuccess()
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h2>Express Interest</h2>

      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="field">
        <label htmlFor="mobile">Mobile</label>
        <input id="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} />
        {errors.mobile && <span className="error">{errors.mobile}</span>}
      </div>

      <div className="field">
        <label htmlFor="postcode">Postcode</label>
        <input id="postcode" value={postcode} onChange={(e) => setPostcode(e.target.value)} />
        {errors.postcode && <span className="error">{errors.postcode}</span>}
      </div>

      <div className="field">
        <label>Services</label>
        <div className="checkboxes">
          {SERVICES.map((s) => (
            <label key={s} className="checkbox-label">
              <input
                type="checkbox"
                checked={services.includes(s)}
                onChange={() => toggleService(s)}
              />
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </label>
          ))}
        </div>
        {errors.services && <span className="error">{errors.services}</span>}
      </div>

      {serverError && <p className="error">{serverError}</p>}
      {success && <p className="success">Thanks! Your interest has been registered.</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
