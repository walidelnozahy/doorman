export interface Page {
  id?: string; // Optional for new entries, required for updates
  user_id?: string;
  name: string;
  provider_account_id: string;
  permissions: object; // JSON IAM Policy
  note?: string;
  created_at?: string; // Automatically set by Supabase
}

export interface Connection {
  id?: string; // Optional for new entries, required for updates
  page_id: string;
  provider_account_id: string;
  connection_id: string;
  created_at?: string; // Automatically set by Supabase
  status?:
    | 'idle'
    | 'connecting'
    | 'connected'
    | 'disconnecting'
    | 'disconnected'
    | 'error';
}

export interface TemplateRequest {
  title: string;
  description: string;
  pageId: string;
  accountId: string;
  permissions: any;
}
