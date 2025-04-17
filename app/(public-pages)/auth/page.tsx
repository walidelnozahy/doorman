import { signInSignUpWithOtpAction } from '@/app/actions/auth';
import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className='flex items-center justify-center h-full bg-gradient-to-br from-background via-background/95 to-background/90 p-4'>
      <div className='w-full max-w-md space-y-6 animate-fade-up'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold tracking-tight'>Welcome back</h1>
          <p className='mt-2 text-muted-foreground'>
            Enter your email to continue to your account
          </p>
        </div>

        <Card className='shadow-lg border-border/40 bg-card/95'>
          <CardContent className='pt-6'>
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
          </CardContent>
        </Card>

        <div className='text-center text-sm text-muted-foreground'>
          <p>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
