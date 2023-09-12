import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { Uplaod } from '@/components/Upload'

describe('<Upload />', () => {
  test('Should call onChange', async () => {
    const onChange = jest.fn()

    render(<Uplaod onChange={onChange} />)

    fireEvent.change(screen.getByTestId('file'), {
      target: {
        files: [new File(['text'], 'file.txt', {
          type: 'text/plain'
        })]
      }
    })

    expect(onChange).toHaveBeenCalled()
  })
})
