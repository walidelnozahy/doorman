'use client';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { useRef } from 'react';
import { useIsVisible } from '@/components/hooks/use-is-visible';

const faqs = [
  {
    question: 'What is Doorman and how does it work?',
    answer:
      'Doorman is a secure, hosted page that lets your users grant you least-privileged access to their AWS accounts. You send your users a link, they approve access, and you get the credentials you need—no manual setup or risky sharing.',
  },
  {
    question: 'Is Doorman secure?',
    answer:
      "Yes! Security is our top priority. All access is least-privileged, temporary, and fully auditable. We never store your user's AWS credentials, and all actions are encrypted in transit and at rest.",
  },
  {
    question: 'What is a connection?',
    answer:
      'A connection is a unique AWS account that your users have granted you access to via Doorman. Each time a user connects their AWS account, it counts as one connection toward your plan limit.',
  },
  {
    question: 'How do I get started?',
    answer:
      'Just sign up, create your branded access page, and share the link with your users. You can start for free and upgrade as you grow.',
  },
  {
    question: 'Can I use my own branding?',
    answer:
      'Yes! Paid plans let you fully customize your access page with your logo, colors, and company details.',
  },
  {
    question: 'What support do you offer?',
    answer:
      'We offer email support for all plans, and priority support for paid tiers. Enterprise customers get a dedicated support manager.',
  },
  {
    question: 'Can I cancel or change my plan anytime?',
    answer:
      'Absolutely. You can upgrade, downgrade, or cancel your subscription at any time from your dashboard.',
  },
];

export function FAQSection() {
  const ref = useRef<HTMLElement | null>(null);
  const isVisible = useIsVisible(ref);
  return (
    <div
      className={`w-full ${isVisible ? 'animate-fade-up animate-fade-up-delay-1200' : ''}`}
    >
      <section ref={ref} className='container max-w-3xl mx-auto px-4'>
        <div>
          <div className='mb-8 text-center'>
            <h2 className='text-2xl font-semibold mb-2'>
              Frequently Asked Questions
            </h2>
            <p className='text-muted-foreground max-w-2xl mx-auto'>
              Everything you need to know about Doorman, AWS access, and our
              service.
            </p>
          </div>
          <Accordion
            type='multiple'
            className='w-full rounded-lg border border-border/50 bg-background shadow-sm'
          >
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={faq.question}>
                <AccordionTrigger className='font-medium py-4 px-4'>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className='text-muted-foreground px-4 pb-4'>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
