export interface Page {
  id?: string; // Optional for new entries, required for updates
  user_id?: string;
  name: string;
  account_id: string;
  permissions: object; // JSON IAM Policy
  note?: string;
  created_at?: string; // Automatically set by Supabase
  status?: 'connecting' | 'connected' | 'disconnecting' | 'disconnected';
  connection_id?: string;
}
