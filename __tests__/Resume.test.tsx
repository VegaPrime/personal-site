import { render, screen } from '@testing-library/react'
import Resume from '@/components/Resume'

jest.mock('@/data/resume', () => ({
  resume: {
    hasDocx: false,
    experience: [
      {
        company: 'Test Corp',
        role: 'Engineer',
        period: '2022 – Present',
        bullets: ['Did some things.', 'Did more things.'],
      },
    ],
    education: [
      {
        school: 'Test University',
        degree: 'B.S. Computer Science',
        year: '2022',
      },
    ],
  },
}))

describe('Resume', () => {
  it('renders the PDF iframe', () => {
    render(<Resume />)
    const iframe = document.querySelector('iframe')
    expect(iframe).toHaveAttribute('src', '/resume.pdf')
  })

  it('renders the PDF download button', () => {
    render(<Resume />)
    const link = screen.getByRole('link', { name: /download pdf/i })
    expect(link).toHaveAttribute('href', '/resume.pdf')
  })

  it('does not render Word download button when hasDocx is false', () => {
    render(<Resume />)
    expect(screen.queryByRole('link', { name: /download word/i })).not.toBeInTheDocument()
  })

  it('renders experience entries', () => {
    render(<Resume />)
    expect(screen.getByText('Test Corp')).toBeInTheDocument()
    expect(screen.getByText('Engineer')).toBeInTheDocument()
  })
})
