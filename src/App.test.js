import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Cars/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders list of cars', () => {
    render(<App />);
    const linkElement = screen.getByText(/Mercedes/i);
    expect(linkElement).toBeInTheDocument();
});
