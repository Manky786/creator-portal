// =============================================
// STAGE Creator Portal - Database Types
// Auto-generated from schema
// =============================================

export type UserRole = 'admin' | 'creator';

export type ProjectStatus =
  | 'draft'
  | 'in_review'
  | 'approved'
  | 'in_production'
  | 'post_production'
  | 'delivered'
  | 'released'
  | 'on_hold'
  | 'cancelled';

export type ProjectFormat = 'film' | 'web_series' | 'microdrama' | 'documentary' | 'other';

export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent';

export type DocumentCategory =
  | 'script'
  | 'budget'
  | 'schedule'
  | 'noc'
  | 'agreement'
  | 'invoice'
  | 'dpr'
  | 'creative'
  | 'delivery'
  | 'other';

export type DocumentStatus = 'pending' | 'approved' | 'rejected' | 'revision_requested';

export type InvoiceStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'paid' | 'rejected';

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'project' | 'document' | 'payment';

export type InviteStatus = 'pending' | 'accepted' | 'expired' | 'cancelled';

// =============================================
// TABLE TYPES
// =============================================

export interface Profile {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  company_name: string | null;
  pan_number: string | null;
  gst_number: string | null;
  bank_account_name: string | null;
  bank_account_number: string | null;
  bank_ifsc: string | null;
  bank_name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  language: string;
  format: ProjectFormat;
  genre: string | null;
  total_budget: number;
  creator_margin_percent: number;
  working_budget: number; // Generated
  status: ProjectStatus;
  priority: ProjectPriority;

  // Dates
  start_date: string | null;
  expected_end_date: string | null;
  actual_end_date: string | null;
  shoot_start_date: string | null;
  shoot_end_date: string | null;

  // Content
  episode_count: number;
  runtime_minutes: number | null;

  // Team
  created_by: string | null;
  assigned_creator_id: string | null;

  // Metadata
  thumbnail_url: string | null;
  notes: string | null;
  tags: string[] | null;

  created_at: string;
  updated_at: string;

  // Joined data (optional)
  creator?: Profile;
  created_by_user?: Profile;
}

export interface ProjectTeam {
  id: string;
  project_id: string;
  user_id: string;
  role: string;
  is_lead: boolean;
  joined_at: string;

  // Joined
  user?: Profile;
  project?: Project;
}

export interface Document {
  id: string;
  project_id: string;
  uploaded_by: string | null;

  name: string;
  description: string | null;
  category: DocumentCategory;
  file_url: string;
  file_type: string | null;
  file_size: number | null;

  version: number;
  status: DocumentStatus;
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;

  created_at: string;
  updated_at: string;

  // Joined
  uploader?: Profile;
  approver?: Profile;
  project?: Project;
}

export interface Invoice {
  id: string;
  project_id: string;
  creator_id: string | null;

  invoice_number: string;
  tranch_number: 1 | 2 | 3 | 4;
  tranch_description: string | null;

  amount: number;
  gst_percent: number;
  gst_amount: number; // Generated
  total_amount: number; // Generated

  status: InvoiceStatus;

  submitted_at: string | null;
  approved_by: string | null;
  approved_at: string | null;
  paid_at: string | null;
  payment_reference: string | null;
  rejection_reason: string | null;

  invoice_file_url: string | null;

  created_at: string;
  updated_at: string;

  // Joined
  creator?: Profile;
  approver?: Profile;
  project?: Project;
}

export interface Notification {
  id: string;
  user_id: string;

  title: string;
  message: string;
  type: NotificationType;

  related_project_id: string | null;
  related_document_id: string | null;
  related_invoice_id: string | null;

  is_read: boolean;
  read_at: string | null;

  created_at: string;

  // Joined
  project?: Project;
}

export interface CreatorInvite {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string;

  invite_code: string;
  invited_by: string | null;
  project_id: string | null;

  status: InviteStatus;
  accepted_at: string | null;
  expires_at: string;

  created_at: string;

  // Joined
  inviter?: Profile;
  project?: Project;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  project_id: string | null;

  action: string;
  entity_type: string;
  entity_id: string | null;

  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;

  ip_address: string | null;
  user_agent: string | null;

  created_at: string;

  // Joined
  user?: Profile;
  project?: Project;
}

// =============================================
// INPUT TYPES (for creating/updating)
// =============================================

export interface CreateProjectInput {
  title: string;
  description?: string;
  language: string;
  format: ProjectFormat;
  genre?: string;
  total_budget: number;
  creator_margin_percent?: number;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  start_date?: string;
  expected_end_date?: string;
  episode_count?: number;
  runtime_minutes?: number;
  assigned_creator_id?: string;
  notes?: string;
  tags?: string[];
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {
  id: string;
}

export interface CreateInviteInput {
  email?: string;
  phone?: string;
  full_name: string;
  project_id?: string;
}

export interface CreateDocumentInput {
  project_id: string;
  name: string;
  description?: string;
  category: DocumentCategory;
  file_url: string;
  file_type?: string;
  file_size?: number;
}

export interface CreateInvoiceInput {
  project_id: string;
  tranch_number: 1 | 2 | 3 | 4;
  tranch_description?: string;
  amount: number;
}

// =============================================
// RESPONSE TYPES
// =============================================

export interface DashboardStats {
  total_projects: number;
  active_projects: number;
  total_creators: number;
  total_budget: number;
  pending_invoices: number;
  pending_documents: number;
  projects_by_status: Record<ProjectStatus, number>;
  projects_by_language: Record<string, number>;
}

export interface CreatorDashboard {
  assigned_projects: Project[];
  pending_tasks: number;
  submitted_invoices: Invoice[];
  recent_notifications: Notification[];
}
