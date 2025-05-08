import { ThemeToggle } from './theme-toggle';

export default async function Footer() {
  return (
    <footer className='border-t'>
      <div className='container mx-auto px-4 py-8'>
        <div className='flex items-center justify-center gap-2'>
          <span className='text-sm text-muted-foreground'>
            © {new Date().getFullYear()} Doorman. All rights reserved.
          </span>
          <ThemeToggle size='sm' />
        </div>
      </div>
    </footer>
  );
}
