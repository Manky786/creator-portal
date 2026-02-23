// =============================================
// STAGE Creator Portal - Database Operations
// =============================================

import { supabase } from './supabase';
import type {
  Profile,
  Project,
  Document,
  Invoice,
  Notification,
  CreatorInvite,
  CreateProjectInput,
  UpdateProjectInput,
  CreateInviteInput,
  CreateDocumentInput,
  CreateInvoiceInput,
  DashboardStats,
  ProjectStatus,
} from './database.types';

// =============================================
// AUTH & PROFILE OPERATIONS
// =============================================

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
}

export async function updateProfile(profileData: Partial<Profile>) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAllCreators(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'creator')
    .eq('is_active', true)
    .order('full_name');

  if (error) throw error;
  return data || [];
}

export async function getProfileById(id: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

// =============================================
// PROJECT OPERATIONS
// =============================================

export async function getProjects(filters?: {
  status?: ProjectStatus;
  creator_id?: string;
  language?: string;
}): Promise<Project[]> {
  let query = supabase
    .from('projects')
    .select(`
      *,
      creator:profiles!assigned_creator_id(id, full_name, email, phone, avatar_url),
      created_by_user:profiles!created_by(id, full_name)
    `)
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.creator_id) {
    query = query.eq('assigned_creator_id', filters.creator_id);
  }
  if (filters?.language) {
    query = query.eq('language', filters.language);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      creator:profiles!assigned_creator_id(*),
      created_by_user:profiles!created_by(id, full_name)
    `)
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function getMyProjects(): Promise<Project[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('assigned_creator_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('projects')
    .insert({
      ...input,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProject(input: UpdateProjectInput): Promise<Project> {
  const { id, ...updateData } = input;

  const { data, error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function assignCreatorToProject(projectId: string, creatorId: string): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .update({ assigned_creator_id: creatorId })
    .eq('id', projectId)
    .select()
    .single();

  if (error) throw error;

  // Send notification to creator
  await createNotification({
    user_id: creatorId,
    title: 'New Project Assigned',
    message: `You have been assigned to a new project: ${data.title}`,
    type: 'project',
    related_project_id: projectId,
  });

  return data;
}

export async function updateProjectStatus(projectId: string, status: ProjectStatus): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .update({ status })
    .eq('id', projectId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProject(projectId: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) throw error;
}

// =============================================
// DOCUMENT OPERATIONS
// =============================================

export async function getProjectDocuments(projectId: string): Promise<Document[]> {
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      uploader:profiles!uploaded_by(id, full_name),
      approver:profiles!approved_by(id, full_name)
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function uploadDocument(input: CreateDocumentInput): Promise<Document> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('documents')
    .insert({
      ...input,
      uploaded_by: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function approveDocument(documentId: string): Promise<Document> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('documents')
    .update({
      status: 'approved',
      approved_by: user.id,
      approved_at: new Date().toISOString(),
    })
    .eq('id', documentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function rejectDocument(documentId: string, reason: string): Promise<Document> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('documents')
    .update({
      status: 'rejected',
      approved_by: user.id,
      approved_at: new Date().toISOString(),
      rejection_reason: reason,
    })
    .eq('id', documentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =============================================
// INVOICE OPERATIONS
// =============================================

export async function getProjectInvoices(projectId: string): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      creator:profiles!creator_id(id, full_name),
      approver:profiles!approved_by(id, full_name)
    `)
    .eq('project_id', projectId)
    .order('tranch_number');

  if (error) throw error;
  return data || [];
}

export async function getMyInvoices(): Promise<Invoice[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      project:projects(id, title)
    `)
    .eq('creator_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createInvoice(input: CreateInvoiceInput): Promise<Invoice> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  // Generate invoice number
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const invoiceNumber = `STAGE/${year}${month}/${random}`;

  const { data, error } = await supabase
    .from('invoices')
    .insert({
      ...input,
      creator_id: user.id,
      invoice_number: invoiceNumber,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function submitInvoice(invoiceId: string): Promise<Invoice> {
  const { data, error } = await supabase
    .from('invoices')
    .update({
      status: 'submitted',
      submitted_at: new Date().toISOString(),
    })
    .eq('id', invoiceId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function approveInvoice(invoiceId: string): Promise<Invoice> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('invoices')
    .update({
      status: 'approved',
      approved_by: user.id,
      approved_at: new Date().toISOString(),
    })
    .eq('id', invoiceId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function markInvoicePaid(invoiceId: string, paymentReference: string): Promise<Invoice> {
  const { data, error } = await supabase
    .from('invoices')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
      payment_reference: paymentReference,
    })
    .eq('id', invoiceId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =============================================
// NOTIFICATION OPERATIONS
// =============================================

export async function getMyNotifications(limit = 20): Promise<Notification[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function getUnreadNotificationCount(): Promise<number> {
  const user = await getCurrentUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_read', false);

  if (error) return 0;
  return count || 0;
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq('id', notificationId);

  if (error) throw error;
}

export async function markAllNotificationsRead(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const { error } = await supabase
    .from('notifications')
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)
    .eq('is_read', false);

  if (error) throw error;
}

async function createNotification(notification: {
  user_id: string;
  title: string;
  message: string;
  type: string;
  related_project_id?: string;
  related_document_id?: string;
  related_invoice_id?: string;
}): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .insert(notification);

  if (error) console.error('Error creating notification:', error);
}

// =============================================
// CREATOR INVITE OPERATIONS
// =============================================

export async function getCreatorInvites(): Promise<CreatorInvite[]> {
  const { data, error } = await supabase
    .from('creator_invites')
    .select(`
      *,
      inviter:profiles!invited_by(id, full_name),
      project:projects(id, title)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createCreatorInvite(input: CreateInviteInput): Promise<CreatorInvite> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  // Generate unique invite code
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let inviteCode = '';
  for (let i = 0; i < 8; i++) {
    inviteCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const { data, error } = await supabase
    .from('creator_invites')
    .insert({
      ...input,
      invite_code: inviteCode,
      invited_by: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getInviteByCode(code: string): Promise<CreatorInvite | null> {
  const { data, error } = await supabase
    .from('creator_invites')
    .select(`
      *,
      project:projects(id, title, language, format, total_budget)
    `)
    .eq('invite_code', code.toUpperCase())
    .eq('status', 'pending')
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error) return null;
  return data;
}

export async function acceptInvite(inviteCode: string, userId: string): Promise<void> {
  const invite = await getInviteByCode(inviteCode);
  if (!invite) throw new Error('Invalid or expired invite');

  // Update invite status
  await supabase
    .from('creator_invites')
    .update({
      status: 'accepted',
      accepted_at: new Date().toISOString(),
    })
    .eq('id', invite.id);

  // If project was pre-assigned, assign it to the creator
  if (invite.project_id) {
    await assignCreatorToProject(invite.project_id, userId);
  }
}

export async function cancelInvite(inviteId: string): Promise<void> {
  const { error } = await supabase
    .from('creator_invites')
    .update({ status: 'cancelled' })
    .eq('id', inviteId);

  if (error) throw error;
}

// =============================================
// DASHBOARD STATS
// =============================================

export async function getDashboardStats(): Promise<DashboardStats> {
  // Get projects
  const { data: projects } = await supabase
    .from('projects')
    .select('status, language, total_budget');

  // Get creators count
  const { count: creatorsCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'creator')
    .eq('is_active', true);

  // Get pending invoices
  const { count: pendingInvoices } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .in('status', ['submitted', 'under_review']);

  // Get pending documents
  const { count: pendingDocs } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  const projectsList = projects || [];

  // Calculate stats
  const projectsByStatus: Record<string, number> = {};
  const projectsByLanguage: Record<string, number> = {};
  let totalBudget = 0;
  let activeCount = 0;

  projectsList.forEach((p) => {
    projectsByStatus[p.status] = (projectsByStatus[p.status] || 0) + 1;
    projectsByLanguage[p.language] = (projectsByLanguage[p.language] || 0) + 1;
    totalBudget += Number(p.total_budget) || 0;

    if (['in_production', 'post_production', 'approved'].includes(p.status)) {
      activeCount++;
    }
  });

  return {
    total_projects: projectsList.length,
    active_projects: activeCount,
    total_creators: creatorsCount || 0,
    total_budget: totalBudget,
    pending_invoices: pendingInvoices || 0,
    pending_documents: pendingDocs || 0,
    projects_by_status: projectsByStatus as Record<ProjectStatus, number>,
    projects_by_language: projectsByLanguage,
  };
}

// =============================================
// FILE UPLOAD
// =============================================

export async function uploadFile(
  file: File,
  bucket: string = 'documents',
  path?: string
): Promise<string> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = path ? `${path}/${fileName}` : `${user.id}/${fileName}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

export async function deleteFile(fileUrl: string, bucket: string = 'documents'): Promise<void> {
  // Extract path from URL
  const url = new URL(fileUrl);
  const pathParts = url.pathname.split('/');
  const filePath = pathParts.slice(pathParts.indexOf(bucket) + 1).join('/');

  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);

  if (error) throw error;
}
