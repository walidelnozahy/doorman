import { signInSignUpWithOtpAction } from '@/app/actions/auth';
import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className='flex items-center justify-center flex-1 h-full my-auto'>
      <Card className='w-full max-w-sm'>
        <CardHeader className='space-y-2 text-center'>
          <h1 className='text-2xl font-medium'>Welcome</h1>
          <p className='text-sm text-muted-foreground'>
            Enter your email to sign in or create an account
          </p>
        </CardHeader>

        <CardContent>
          <form className='space-y-6'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email address</Label>
                <Input
                  name='email'
                  type='email'
                  placeholder='you@example.com'
                  required
                />
              </div>

              <SubmitButton
                pendingText='Sending magic link...'
                formAction={signInSignUpWithOtpAction}
                className='w-full'
              >
                Continue with email
              </SubmitButton>

              <FormMessage message={searchParams} />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
