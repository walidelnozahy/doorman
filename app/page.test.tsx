import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import '@testing-library/jest-dom';

describe('Home Page', () => {
  it('renders heading and description', async () => {
    render(await Home());

    expect(
      screen.getByText(/The easiest way to access your user's AWS account/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /A simple hosted page that enables your users to securely grant you access to their AWS accounts/i,
      ),
    ).toBeInTheDocument();
  });

  it('has a Get Started button that links to /pages', async () => {
    render(await Home());

    const link = screen.getByRole('link', { name: /get started/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/pages');
  });
});
