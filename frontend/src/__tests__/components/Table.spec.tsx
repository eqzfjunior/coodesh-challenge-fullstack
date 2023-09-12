import '@testing-library/jest-dom'
import { Table } from '@/components/Table'
import { render, screen } from '@testing-library/react'

describe('<Table />', () => {
  test('Should render items', async () => {
    const items = [
      {
        sellerName: 'Zé',
        totalSales: 50000,
        totalCommissions: 20000,
        balance: 70000
      },
      {
        sellerName: 'Maria',
        totalSales: 30500,
        totalCommissions: 10000,
        balance: 40500
      }
    ]

    render(<Table items={items} />)

    const rows: HTMLTableRowElement[] = await screen.findAllByTestId('table-row')

    expect(rows[0].cells[0].textContent).toBe('Zé')
    expect(rows[0].cells[1].textContent).toBe('50000')
    expect(rows[0].cells[2].textContent).toBe('20000')
    expect(rows[0].cells[3].textContent).toBe('70000')

    expect(rows[1].cells[0].textContent).toBe('Maria')
    expect(rows[1].cells[1].textContent).toBe('30500')
    expect(rows[1].cells[2].textContent).toBe('10000')
    expect(rows[1].cells[3].textContent).toBe('40500')
  })
})
