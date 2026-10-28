export type SupportTicketStatus =
  | 'OPEN'
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED';

export type SupportTicketPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

/**
 * Developer-facing message shape. Deliberately excludes the staff-only `kind`
 * field and internal-note metadata. The backend never serializes those for the
 * developer endpoints, and these types must not introduce them.
 */
export interface DeveloperMessageAuthor {
  displayName: string | null;
}

export interface DeveloperTicketMessage {
  id: string;
  body: string;
  createdAt: string;
  authorId: string;
  author: DeveloperMessageAuthor | null;
  isStaff: boolean;
}

export interface DeveloperTicketSummary {
  id: string;
  subject: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  category: string | null;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
}

export interface DeveloperTicketDetail extends DeveloperTicketSummary {
  description: string;
  messages: DeveloperTicketMessage[];
}

export interface SupportMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TicketListResponse {
  data: DeveloperTicketSummary[];
  meta: SupportMeta;
}

export const TICKET_STATUS_LABELS: Record<SupportTicketStatus, string> = {
  OPEN: 'Open',
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
};

export const TICKET_PRIORITY_LABELS: Record<SupportTicketPriority, string> = {
  LOW: 'Low',
  NORMAL: 'Normal',
  HIGH: 'High',
  URGENT: 'Urgent',
};

export function isSupportTicketStatus(value: unknown): value is SupportTicketStatus {
  return typeof value === 'string' && value in TICKET_STATUS_LABELS;
}

export function isSupportTicketPriority(value: unknown): value is SupportTicketPriority {
  return typeof value === 'string' && value in TICKET_PRIORITY_LABELS;
}

export function statusLabel(value: unknown): string {
  if (isSupportTicketStatus(value)) return TICKET_STATUS_LABELS[value];
  if (typeof value === 'string' && value.trim()) return value;
  return 'Unknown';
}

export function priorityLabel(value: unknown): string {
  if (isSupportTicketPriority(value)) return TICKET_PRIORITY_LABELS[value];
  if (typeof value === 'string' && value.trim()) return value;
  return '—';
}

/**
 * Extracts a human-readable message from a non-2xx JSON body. Handles both the
 * NestJS ValidationPipe shape (`message` as an array) and plain string messages
 * (rate-limit, NotFound, BadRequest, etc.). Returns null when nothing usable
 * is present so callers can fall back to a generic message.
 */
export function extractErrorMessage(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null;
  const message = (body as { message?: unknown }).message;
  if (typeof message === 'string') return message;
  if (Array.isArray(message)) {
    const parts = message.filter((part): part is string => typeof part === 'string');
    if (parts.length > 0) return parts.join(' ');
  }
  return null;
}
