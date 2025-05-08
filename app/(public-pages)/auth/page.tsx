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
  const hasSuccessMessage = searchParams && 'success' in searchParams;

  return (
    <div className='w-full bg-gradient-to-br from-background via-background/95 to-background/90'>
      <div className='w-full max-w-sm mx-auto space-y-4 animate-fade-up p-4'>
        {!hasSuccessMessage && (
          <div className='text-center space-y-1.5'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Welcome back
            </h1>
            <p className='text-sm text-muted-foreground'>
              Enter your email to continue to your account
            </p>
          </div>
        )}

        <Card className='shadow-sm border-border/30 backdrop-blur-sm bg-background/50'>
          <CardContent className='p-6'>
            {hasSuccessMessage ? (
              <div className='flex flex-col items-center justify-center py-6 space-y-4'>
                <div className='w-16 h-16 rounded-full bg-green-100/50 dark:bg-green-900/20 flex items-center justify-center ring-1 ring-green-200 dark:ring-green-800/30'>
                  <MailCheck className='h-8 w-8 text-green-600 dark:text-green-400' />
                </div>
                <div className='space-y-1.5 text-center'>
                  <h3 className='text-lg font-medium text-green-700 dark:text-green-300'>
                    Magic link sent!
                  </h3>
                  <p className='text-sm text-muted-foreground max-w-[280px]'>
                    We've sent a secure login link to your email address. Please
                    check your inbox and click the link to continue.
                  </p>
                </div>
                <div className='pt-2'>
                  <p className='text-xs text-muted-foreground mb-2'>
                    Didn't receive the email? Check your spam folder or
                  </p>
                  <Link
                    href='/auth'
                    className='inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors'
                  >
                    <ArrowLeft className='h-3.5 w-3.5' />
                    try again
                  </Link>
                </div>
              </div>
            ) : (
              <form className='space-y-4'>
                <div className='space-y-3'>
                  <div className='space-y-1.5'>
                    <Label htmlFor='email' className='text-sm font-medium'>
                      Email address
                    </Label>
                    <div className='relative group'>
                      <Input
                        name='email'
                        type='email'
                        placeholder='you@example.com'
                        required
                        className='pl-9 h-10 text-sm transition-all duration-200 focus-visible:ring-primary/30'
                      />
                      <Mail className='absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground/70 group-focus-within:text-primary transition-colors duration-200' />
                    </div>
                  </div>

                  <SubmitButton
                    pendingText='Sending magic link...'
                    formAction={signInSignUpWithOtpAction}
                    className='w-full h-10 text-sm font-medium transition-all duration-200 hover:shadow-sm'
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
          <div className='text-center'>
            <p className='text-xs text-muted-foreground/80'>
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
