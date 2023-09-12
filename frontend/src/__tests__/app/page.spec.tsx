import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import Home from '@/app/page'

const server = setupServer(
  rest.get('/api/transactions/summary', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          "sellerName": "MARIA CANDIDA",
          "totalSales": 150000,
          "totalCommissions": 0,
          "balance": 150000
        },
        {
          "sellerName": "THIAGO OLIVEIRA",
          "totalSales": 12750,
          "totalCommissions": -4500,
          "balance": 8250
        },
      ])
    )
  }),

  rest.post('/api/transactions/import', (req, res, ctx) => {
    return res(
      ctx.status(201),
    )
  }),
)

describe('<Page />', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())
  
  test('Should fetch the data from the api and show it in the table', async () => {
    render(<Home />)

    const rows: HTMLTableRowElement[] = await screen.findAllByTestId('table-row')

    expect(rows[0].cells[0].textContent).toBe('MARIA CANDIDA')
    expect(rows[0].cells[1].textContent).toBe('150000')
    expect(rows[0].cells[2].textContent).toBe('0')
    expect(rows[0].cells[3].textContent).toBe('150000')
  })

  test('Should display an error message on failure to fetch data from the table', async () => {
    server.use(
      rest.get('/api/transactions/summary', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            message: 'some error'
          })
        )
      })
    )

    render(<Home />)

    const messaError = await screen.findByText('some error')

    expect(messaError).toBeInTheDocument()
  })

  test('Should send the file in the body of the request', async () => {
    const mockFetch = jest.spyOn(globalThis, 'fetch')

    render(<Home />)

    const file = new File(['text'], 'file.txt', {
      type: 'text/plain'
    })

    fireEvent.change(screen.getByTestId('file'), {
      target: {
        files: [file],
      }
    })

    const body = mockFetch.mock.calls[1][1]?.body

    await waitFor(() => {
      expect(body.get('file') instanceof File).toBe(true)
      expect(body.get('file').name).toBe('file.txt')
    })
  })

  test('Should display an error message when upload fails', async () => {
    server.use(
      rest.post('/api/transactions/import', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            message: 'some error'
          })
        )
      })
    )

    render(<Home />)

    const file = new File(['text'], 'file.txt', {
      type: 'text/plain'
    })

    fireEvent.change(screen.getByTestId('file'), {
      target: {
        files: [file],
      }
    })

    const messaError = await screen.findByText('some error')

    expect(messaError).toBeInTheDocument()
  })
})