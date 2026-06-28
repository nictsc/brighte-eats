import { CreateLeadDto, ValidationResult, VALID_SERVICES } from '../types'

export function validateCreateLead(body: Partial<CreateLeadDto>): ValidationResult {
  const errors: string[] = []

  // name
  if (!body.name && body.name !== '') {
    errors.push('name is required')
  } else if (typeof body.name === 'string' && body.name.trim() === '') {
    errors.push('name is required')
  }

  // email
  if (body.email === undefined || body.email === null) {
    errors.push('email is required')
  } else if (typeof body.email === 'string' && body.email.trim() === '') {
    errors.push('email is required')
  } else if (typeof body.email === 'string' && !body.email.includes('@')) {
    errors.push('email is invalid')
  }

  // mobile — Australian mobile: 10 digits starting with 04
  if (body.mobile === undefined || body.mobile === null) {
    errors.push('mobile is required')
  } else if (typeof body.mobile === 'string' && body.mobile.trim() === '') {
    errors.push('mobile is required')
  } else if (typeof body.mobile === 'string' && !/^04\d{8}$/.test(body.mobile.trim())) {
    errors.push('mobile is invalid')
  }

  // postcode — exactly 4 digits
  if (body.postcode === undefined || body.postcode === null) {
    errors.push('postcode is required')
  } else if (typeof body.postcode === 'string' && body.postcode.trim() === '') {
    errors.push('postcode is required')
  } else if (typeof body.postcode === 'string' && !/^\d{4}$/.test(body.postcode.trim())) {
    errors.push('postcode must be a 4-digit Australian postcode')
  }

  // services
  if (!Array.isArray(body.services) || body.services.length === 0) {
    errors.push('at least one service must be selected')
  } else {
    const invalidServices = body.services.filter(
      (s) => !(VALID_SERVICES as readonly string[]).includes(s)
    )
    if (invalidServices.length > 0) {
      errors.push('services must be one of: delivery, pickup, payment')
    }
  }

  return errors.length === 0 ? { valid: true, errors: [] } : { valid: false, errors }
}
