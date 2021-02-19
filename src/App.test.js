import { render, screen } from '@testing-library/react'
import App from './App'

//that should be proper test, it is boilerplated one and fails now
test('renders learn react link', () => {
	render(<App />)
	const linkElement = screen.getByText(/learn react/i)
	expect(linkElement).toBeInTheDocument()
})
