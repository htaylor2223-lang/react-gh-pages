import { render, screen } from '@testing-library/react';
import App from './App';

test('renders CRM title', () => {
  render(<App />);
  const title = screen.getByText(/Tailored Contracting CRM/i);
  expect(title).toBeInTheDocument();
});