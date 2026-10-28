import type { SupportTicketStatus, SupportTicketPriority } from './support';

export type SupportMessageKind = 'REPLY' | 'NOTE';

export interface StaffUserRef {
  id: string;
  displayName: string | null;
}

export interface StaffMessage {
  id: string;
  body: string;
  kind: SupportMessageKind;
  createdAt: string;
  authorId: string;
  author: { displayName: string | null } | null;
}

export interface StaffTicketBase {
  id: string;
  subject: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  category: string | null;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  reporter: StaffUserRef | null;
  assignee: StaffUserRef | null;
}

export interface StaffTicketSummary extends StaffTicketBase {
  messageCount: number;
}

export interface StaffTicketDetail extends StaffTicketBase {
  description: string;
  messages: StaffMessage[];
}

export interface StaffMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StaffTicketListResponse {
  data: StaffTicketSummary[];
  meta: StaffMeta;
}

export const MESSAGE_KIND_LABELS: Record<SupportMessageKind, string> = {
  REPLY: 'Reply',
  NOTE: 'Internal note',
};

export function isSupportMessageKind(value: unknown): value is SupportMessageKind {
  return value === 'REPLY' || value === 'NOTE';
}

export function messageKindLabel(value: unknown): string {
  return isSupportMessageKind(value) ? MESSAGE_KIND_LABELS[value] : 'Message';
}
