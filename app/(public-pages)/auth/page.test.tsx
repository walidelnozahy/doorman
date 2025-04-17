import { render, screen } from '@testing-library/react';
import Login from './page';
import { Message } from '@/components/form-message';

// Mock the auth action
jest.mock('@/app/actions/auth', () => ({
  signInSignUpWithOtpAction: jest.fn(),
}));

// Mock the UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div data-testid='card'>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='card-content'>{children}</div>
  ),
  CardHeader: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div data-testid='card-header'>{children}</div>,
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => (
    <input data-testid='input' id={props.name} {...props} />
  ),
}));

jest.mock('@/components/ui/label', () => ({
  Label: ({
    children,
    htmlFor,
  }: {
    children: React.ReactNode;
    htmlFor: string;
  }) => (
    <label data-testid='label' htmlFor={htmlFor}>
      {children}
    </label>
  ),
}));

// Mock the components
jest.mock('@/components/form-message', () => ({
  FormMessage: ({ message }: { message: any }) => (
    <div data-testid='form-message'>{message?.error || message?.success}</div>
  ),
  Message: jest.requireActual('@/components/form-message').Message,
}));

jest.mock('@/components/submit-button', () => ({
  SubmitButton: ({
    children,
    formAction,
  }: {
    children: React.ReactNode;
    formAction: any;
  }) => <button data-testid='submit-button'>{children}</button>,
}));

describe('Login Page', () => {
  it('renders the login form', async () => {
    const mockSearchParams = Promise.resolve({} as Message);

    render(await Login({ searchParams: mockSearchParams }));

    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(
      screen.getByText('Enter your email to sign in or create an account'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('input')).toBeInTheDocument();
    expect(screen.getByTestId('label')).toHaveTextContent('Email address');
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    expect(screen.getByText('Continue with email')).toBeInTheDocument();
  });

  it('displays error message when provided', async () => {
    const mockSearchParams = Promise.resolve({
      error: 'Invalid email',
    } as Message);

    render(await Login({ searchParams: mockSearchParams }));

    expect(screen.getByTestId('form-message')).toHaveTextContent(
      'Invalid email',
    );
  });

  it('displays success message when provided', async () => {
    const mockSearchParams = Promise.resolve({
      success: 'Check your email',
    } as Message);

    render(await Login({ searchParams: mockSearchParams }));

    expect(screen.getByTestId('form-message')).toHaveTextContent(
      'Check your email',
    );
  });
});
