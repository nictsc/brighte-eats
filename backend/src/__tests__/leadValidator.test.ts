import { validateCreateLead } from '../validation/leadValidator'
import { CreateLeadDto } from '../types'

const validDto: CreateLeadDto = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  mobile: '0412345678',
  postcode: '2000',
  services: ['delivery']
}

describe('validateCreateLead', () => {
  it('returns valid and no errors for a fully valid DTO', () => {
    expect(validateCreateLead(validDto)).toEqual({ valid: true, errors: [] })
  })

  it('returns errors for all empty required fields', () => {
    const result = validateCreateLead({ name: '', email: '', mobile: '', postcode: '', services: [] })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('name is required')
    expect(result.errors).toContain('email is required')
    expect(result.errors).toContain('mobile is required')
    expect(result.errors).toContain('postcode is required')
    expect(result.errors).toContain('at least one service must be selected')
  })

  it('rejects a 4-digit postcode that is outside valid Australian ranges', () => {
    const result = validateCreateLead({ ...validDto, postcode: '0050' })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('postcode is not a valid Australian postcode')
  })

  it('returns errors for invalid data in each field', () => {
    const result = validateCreateLead({
      name: 'Jane',
      email: 'notanemail',
      mobile: '123',
      postcode: '200',
      services: ['dine-in' as any]
    })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('email is invalid')
    expect(result.errors).toContain('mobile is invalid')
    expect(result.errors.some((e) => e.includes('postcode'))).toBe(true)
    expect(result.errors.some((e) => e.includes('services'))).toBe(true)
  })
})
