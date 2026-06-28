import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import RegistrationForm from '../components/RegistrationForm'

vi.mock('../api', () => ({
  createLead: vi.fn(),
}))

import { createLead } from '../api'
const mockCreateLead = vi.mocked(createLead)

function renderForm() {
  const onSuccess = vi.fn()
  render(<RegistrationForm onSuccess={onSuccess} />)
  return { onSuccess }
}

describe('RegistrationForm validation', () => {
  afterEach(() => {
    mockCreateLead.mockReset()
  })

  it('shows required-field errors for every field when the form is submitted empty', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(screen.getByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Mobile is required')).toBeInTheDocument()
    expect(screen.getByText('Postcode is required')).toBeInTheDocument()
    expect(screen.getByText('Select at least one service')).toBeInTheDocument()
    expect(mockCreateLead).not.toHaveBeenCalled()
  })

  it('shows "Enter a valid Australian postcode" for a 4-digit postcode outside valid Australian ranges', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.type(screen.getByLabelText(/name/i), 'Jane Smith')
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com')
    await user.type(screen.getByLabelText(/mobile/i), '0412345678')
    await user.type(screen.getByLabelText(/postcode/i), '0050')
    await user.click(screen.getByLabelText(/delivery/i))

    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(screen.getByText('Enter a valid Australian postcode')).toBeInTheDocument()
    expect(mockCreateLead).not.toHaveBeenCalled()
  })

  it('shows "Mobile is invalid" when an incorrectly formatted mobile number is submitted', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.type(screen.getByLabelText(/name/i), 'Jane Smith')
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com')
    await user.type(screen.getByLabelText(/mobile/i), '04')
    await user.type(screen.getByLabelText(/postcode/i), '2000')
    await user.click(screen.getByLabelText(/delivery/i))

    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(screen.getByText('Mobile must be a 10-digit Australian mobile starting with 04')).toBeInTheDocument()
    expect(mockCreateLead).not.toHaveBeenCalled()
  })
})
