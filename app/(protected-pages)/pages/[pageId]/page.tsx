import { notFound } from 'next/navigation';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Globe, Link2, Shield, GlobeLockIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatDate } from '@/utils/ago';
import { EmptyState } from '@/components/empty-state';
import { PermissionsViewer } from '@/components/permissions-viewer';
import { ConnectionsTable } from '@/components/features/connections/components/connections-table';
import { OpenInNewTabButton } from '@/components/open-in-new-tab-button';
import { fetchPage } from '@/lib/supabase/access-pages/get';
import { fetchConnections } from '@/lib/supabase/connections/get';
import { Suspense } from 'react';
import { AddDomainTrigger } from '@/components/features/custom-domains/add-domain-trigger';
import { CreateConnectionTrigger } from '@/components/features/connections/create-connection-trigger';
import { AccessPageDetailsSkeleton } from '@/components/features/access-pages/components/access-page-details-skeleton';
import { fetchCustomDomains } from '@/app/actions/fetch-custom-domains';
import { CopyButton } from '@/components/copy-button';
import { StatusBadge } from '@/components/status-badge';
import config from '@/config';
import { DomainStatusCard } from '@/components/features/custom-domains/components/domain-status-card';

type PageDetailsProps = {
  params: Promise<{ pageId: string }>;
};

const tabs = [
  {
    value: 'connections',
    label: 'Connections',
    icon: Link2,
  },
  {
    value: 'domains',
    label: 'Domains',
    icon: Globe,
  },
];

export default async function PageDetails({ params }: PageDetailsProps) {
  const pageId = (await params).pageId;
  let page;
  let connections;
  let domains;
  try {
    const [pageResult, connectionsResult, domainsResult] =
      await Promise.allSettled([
        fetchPage(pageId),
        fetchConnections(pageId),
        fetchCustomDomains(pageId),
      ]);

    if (pageResult.status === 'fulfilled') {
      page = pageResult.value;
    }
    if (connectionsResult.status === 'fulfilled') {
      connections = connectionsResult.value;
    }
    if (domainsResult.status === 'fulfilled') {
      domains = domainsResult.value;
    }

    if (!page) {
      return notFound();
    }
  } catch (error) {
    return (
      <div className='container mx-auto py-10 flex-1 flex items-center justify-center'>
        <Alert variant='destructive' className='max-w-lg w-full'>
          <div className='flex flex-col items-center text-center'>
            <AlertCircle className='h-8 w-8 mb-2' />
            <AlertTitle className='text-lg mb-2'>
              Unable to Load Page Details
            </AlertTitle>
            <AlertDescription className='flex flex-col gap-2'>
              <p>There was an error loading the page details.</p>
              {error instanceof Error && (
                <code className='text-sm font-mono bg-destructive/10 p-2 rounded block'>
                  {error.message}
                </code>
              )}
            </AlertDescription>
          </div>
        </Alert>
      </div>
    );
  }

  const connectedCount = connections?.filter(
    (c) => c.status === 'connected',
  ).length;
  const disconnectedCount = connections?.filter(
    (c) => c.status === 'disconnected',
  ).length;

  if (!page || !connections) {
    return <AccessPageDetailsSkeleton />;
  }

  return (
    <Suspense fallback={<AccessPageDetailsSkeleton />}>
      <div className='flex flex-col min-h-screen bg-background'>
        <header className='bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 sticky top-0'>
          <div className='container flex h-16 items-center justify-between py-12'>
            <h1 className='text-2xl font-semibold'>{page.title}</h1>
            <div className='flex items-center gap-2'>
              <CopyButton
                value={pageId}
                variant='outline'
                className='bg-background-secondary'
              />
              <OpenInNewTabButton
                path={`/${pageId}`}
                variant='outline'
                className='bg-background-secondary'
              />
            </div>
          </div>
        </header>

        <main className='flex-1 container mb-12 space-y-8'>
          {/* Page Details Card */}
          <div className='grid grid-cols-1 lg:grid-cols-7 gap-6'>
            {/* Left column - Details */}
            <div className='lg:col-span-4 space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Details</CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <p className='text-sm text-muted-foreground mb-1'>
                        Title
                      </p>
                      <p>{page.title}</p>
                    </div>
                    <div>
                      <p className='text-sm text-muted-foreground mb-1'>
                        AWS Account
                      </p>
                      <p className='font-mono'>{page.provider_account_id}</p>
                    </div>
                    <div>
                      <p className='text-sm text-muted-foreground mb-1'>
                        Created
                      </p>
                      <p>{formatDate(page.created_at || '')}</p>
                    </div>
                    {page.note && (
                      <div>
                        <p className='text-sm text-muted-foreground mb-1'>
                          Notes
                        </p>
                        <p className='whitespace-pre-wrap'>{page.note}</p>
                      </div>
                    )}
                  </div>

                  <div className='space-y-4 border-t pt-4'>
                    <div>
                      <p className='text-sm text-muted-foreground mb-2'>
                        Access URLs
                      </p>
                      <div className='space-y-2'>
                        <div className='flex items-center gap-2 text-sm text-muted-foreground/60 group'>
                          <GlobeLockIcon className='h-4 w-4' />
                          <span className='max-w-[280px] truncate group-hover:text-muted-foreground/80 transition-colors duration-300'>
                            {`${config.origin}/${page.id}`}
                          </span>
                          <CopyButton
                            value={`${config.origin}/${page.id}`}
                            size='sm'
                          />
                        </div>
                        {domains && domains.length > 0 && (
                          <div className='flex items-center gap-2 text-sm text-muted-foreground/60 group'>
                            <Globe className='h-4 w-4' />
                            <span className='max-w-[280px] truncate group-hover:text-muted-foreground/80 transition-colors duration-300'>
                              {`https://${domains[0].domain}`}
                            </span>
                            <CopyButton
                              value={`https://${domains[0].domain}`}
                              size='sm'
                            />
                            {domains[0].is_verified ? (
                              <StatusBadge
                                status='active'
                                size='sm'
                                text='Verified'
                              />
                            ) : (
                              <StatusBadge
                                status='pending'
                                size='sm'
                                text='Pending'
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Connection Stats */}
              <div className='grid grid-cols-3 gap-4'>
                <Card>
                  <CardContent className='pt-6'>
                    <div className='flex flex-col gap-1'>
                      <p className='text-sm text-muted-foreground'>
                        Total Connections
                      </p>
                      <p className='text-3xl font-bold'>{connections.length}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className='pt-6'>
                    <div className='flex flex-col gap-1'>
                      <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 rounded-full bg-emerald-500/70'></div>
                        <p className='text-sm text-muted-foreground'>
                          Connected
                        </p>
                      </div>
                      <p className='text-3xl font-bold'>{connectedCount}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className='pt-6'>
                    <div className='flex flex-col gap-1'>
                      <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 rounded-full bg-destructive/70'></div>
                        <p className='text-sm text-muted-foreground'>
                          Disconnected
                        </p>
                      </div>
                      <p className='text-3xl font-bold'>{disconnectedCount}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right column - Permissions */}
            <div className='lg:col-span-3'>
              <Card className='h-full'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-lg flex items-center gap-2'>
                    <Shield className='h-4 w-4' />
                    Permissions
                  </CardTitle>
                  <CardDescription>Access policy for this page</CardDescription>
                </CardHeader>
                <CardContent>
                  <PermissionsViewer permissions={page.permissions} />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tabs for Connections and Domains */}
          <Tabs defaultValue='connections' className='w-full'>
            <div className='border-b'>
              <div className='flex items-center justify-between'>
                <TabsList className='h-10 bg-transparent p-0'>
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className='group relative data-[state=active]:shadow-none rounded-none px-4 h-10 bg-transparent transition-colors duration-200'
                      >
                        <div className='flex items-center gap-2 text-sm'>
                          <Icon className='h-4 w-4' />
                          <span>{tab.label}</span>
                        </div>
                        <span className='absolute -bottom-[1px] left-[50%] h-[2px] w-0 -translate-x-[50%] bg-primary transition-[width] duration-200 ease-out group-data-[state=active]:w-full' />
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>
            </div>

            <TabsContent value='connections' className='pt-6 animate-fade-up'>
              <div className='flex items-center justify-between mb-6'>
                <div className='space-y-1'>
                  <h2 className='text-xl font-semibold tracking-tight'>
                    Connections
                  </h2>
                  <p className='text-sm text-muted-foreground'>
                    Manage your AWS account connections
                  </p>
                </div>
                <CreateConnectionTrigger
                  providerAccountId={page.provider_account_id}
                />
              </div>
              {connections && connections.length > 0 ? (
                <ConnectionsTable connections={connections} pageId={pageId} />
              ) : (
                <Card>
                  <CardContent>
                    <EmptyState
                      title='No connections found'
                      description='Create a connection to get started with AWS account access.'
                    />
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value='domains' className='pt-6 animate-fade-up'>
              <div className='flex items-center justify-between mb-6'>
                <div className='space-y-1'>
                  <h2 className='text-xl font-semibold tracking-tight'>
                    Custom Domains
                  </h2>
                  <p className='text-sm text-muted-foreground'>
                    Configure custom domains for your access page
                  </p>
                </div>
                <AddDomainTrigger />
              </div>
              {domains && domains.length > 0 ? (
                <div className='space-y-4'>
                  {domains.map((domain) => (
                    <DomainStatusCard
                      key={domain.id}
                      domain={domain.domain}
                      isVerified={domain.is_verified}
                      isConfigured={domain.is_configured}
                      verificationDetails={domain.verification_details}
                      configurationDetails={domain.configuration_details}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className='py-6'>
                    <EmptyState
                      title='No domains configured'
                      description='Add a custom domain to get started.'
                    />
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </Suspense>
  );
}
