import { signInSignUpWithOtpAction } from '@/app/actions/auth';
import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, MailCheck } from 'lucide-react';
import Link from 'next/link';

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  // Check if we have a success message
  const hasSuccessMessage = searchParams && 'success' in searchParams;

  return (
    <div className='flex items-center justify-center h-full bg-gradient-to-br from-background via-background/95 to-background/90 p-4'>
      <div className='w-full max-w-md space-y-6 animate-fade-up'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold tracking-tight'>
            {hasSuccessMessage ? 'Check your email' : 'Welcome back'}
          </h1>
          <p className='mt-2 text-muted-foreground'>
            {hasSuccessMessage
              ? 'We sent you a magic link to sign in to your account'
              : 'Enter your email to continue to your account'}
          </p>
        </div>

        <Card className='shadow-lg border-border/40 bg-background-secondary'>
          <CardContent className='pt-6'>
            {hasSuccessMessage ? (
              <div className='flex flex-col items-center justify-center py-8 px-4 text-center space-y-5'>
                <div className='w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shadow-sm'>
                  <MailCheck className='h-10 w-10 text-green-600 dark:text-green-400' />
                </div>
                <div className='space-y-2'>
                  <h3 className='text-xl font-semibold text-green-700 dark:text-green-300'>
                    Magic link sent!
                  </h3>
                  <p className='text-muted-foreground'>
                    We've sent a secure login link to your email address. Please
                    check your inbox and click the link to continue.
                  </p>
                </div>
                <div className='pt-2'>
                  <p className='text-sm text-muted-foreground mb-3'>
                    Didn't receive the email? Check your spam folder or
                  </p>
                  <Link
                    href='/auth'
                    className='inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline'
                  >
                    <ArrowLeft className='h-4 w-4' />
                    try again
                  </Link>
                </div>
              </div>
            ) : (
              <form className='space-y-5'>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='email' className='text-sm font-medium'>
                      Email address
                    </Label>
                    <div className='relative group'>
                      <Input
                        name='email'
                        type='email'
                        placeholder='you@example.com'
                        required
                        className='pl-10 h-12 transition-all duration-200 focus-visible:ring-primary/50'
                      />
                      <Mail className='absolute left-3 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200' />
                    </div>
                  </div>

                  <SubmitButton
                    pendingText='Sending magic link...'
                    formAction={signInSignUpWithOtpAction}
                    className='w-full h-12 font-medium text-base transition-all duration-200 hover:shadow-md'
                  >
                    Continue with email
                  </SubmitButton>

                  <FormMessage message={searchParams} />
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {!hasSuccessMessage && (
          <div className='text-center text-sm text-muted-foreground'>
            <p>
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
