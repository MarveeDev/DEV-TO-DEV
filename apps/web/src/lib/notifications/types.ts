export type NotificationType =
  | 'CONNECTION_REQUEST'
  | 'CONNECTION_ACCEPTED'
  | 'CONNECTION_REJECTED'
  | 'MESSAGE'
  | 'SYSTEM'
  | 'SUPPORT';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string | null;
  message: string;
  metadata?: { ticketId?: string } | null;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}
