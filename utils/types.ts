export interface Page {
  slug?: string;
  id: string; // Optional for new entries, required for updates
  user_id?: string;
  title: string;
  provider_account_id: string;
  permissions: object; // JSON IAM Policy
  note?: string;
  created_at?: string; // Automatically set by Supabase
  template_url?: string;
}

export interface Connection {
  id?: string; // Optional for new entries, required for updates
  page_id: string;
  provider_account_id: string;
  consumer_account_id: string;
  connection_id: string;
  created_at?: string; // Automatically set by Supabase
  status?: ConnectionStatus;
}

export interface TemplateRequest {
  title: string;
  description: string;
  pageId: string;
  providerAccountId: string;
  permissions: any;
}

export type ConnectionStatus =
  | 'connected'
  | 'connecting'
  | 'disconnecting'
  | 'disconnected';
