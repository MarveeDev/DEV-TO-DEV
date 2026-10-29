export type AdminRole =
  | 'USER'
  | 'MODERATOR'
  | 'ADMIN'
  | 'SUPER_ADMIN'
  | 'PLATFORM_ADMIN'
  | 'MARKETING_MANAGER'
  | 'SUPPORT'
  | 'ANALYTICS_VIEWER';

export type AdminPermission =
  | 'overview.view'
  | 'analytics.view'
  | 'users.view'
  | 'users.manage'
  | 'staff.manage'
  | 'content.moderate'
  | 'marketplace.moderate'
  | 'violations.moderate'
  | 'audit.view'
  | 'marketing.manage'
  | 'support.manage';

export const STAFF_ROLES: AdminRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'PLATFORM_ADMIN',
  'MODERATOR',
  'MARKETING_MANAGER',
  'SUPPORT',
  'ANALYTICS_VIEWER',
];

export const ROLE_RANK: Record<AdminRole, number> = {
  USER: 0,
  ANALYTICS_VIEWER: 1,
  SUPPORT: 2,
  MARKETING_MANAGER: 3,
  MODERATOR: 4,
  PLATFORM_ADMIN: 5,
  ADMIN: 6,
  SUPER_ADMIN: 7,
};

const PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  USER: [],
  ANALYTICS_VIEWER: ['overview.view', 'analytics.view'],
  SUPPORT: ['overview.view', 'analytics.view', 'support.manage'],
  MARKETING_MANAGER: ['overview.view', 'analytics.view', 'marketing.manage'],
  MODERATOR: ['overview.view', 'users.view', 'content.moderate', 'marketplace.moderate', 'violations.moderate'],
  PLATFORM_ADMIN: [
    'overview.view',
    'analytics.view',
    'users.view',
    'users.manage',
    'content.moderate',
    'marketplace.moderate',
    'violations.moderate',
    'support.manage',
  ],
  ADMIN: [
    'overview.view',
    'analytics.view',
    'users.view',
    'users.manage',
    'content.moderate',
    'marketplace.moderate',
    'violations.moderate',
    'audit.view',
    'marketing.manage',
    'support.manage',
  ],
  SUPER_ADMIN: [
    'overview.view',
    'analytics.view',
    'users.view',
    'users.manage',
    'staff.manage',
    'content.moderate',
    'marketplace.moderate',
    'violations.moderate',
    'audit.view',
    'marketing.manage',
    'support.manage',
  ],
};

export function hasPermission(role: string | undefined, permission: AdminPermission): boolean {
  if (!role) return false;
  return ((PERMISSIONS as Record<string, AdminPermission[]>)[role] ?? []).includes(permission);
}

export { PERMISSIONS };

export function isStaffRole(role: string | undefined): role is AdminRole {
  if (!role) return false;
  return (STAFF_ROLES as string[]).includes(role);
}

export function canAssignRole(actor: string | undefined, role: AdminRole): boolean {
  if (!actor) return false;
  if (actor === 'SUPER_ADMIN') return true;
  return ((ROLE_RANK as Record<string, number>)[actor] ?? 0) > ((ROLE_RANK as Record<string, number>)[role] ?? 0);
}

/**
 * Default landing path inside the admin workspace for each staff role. Mirrors
 * the backend `staffWorkspacePath` so login redirects and client navigation
 * stay consistent.
 */
export function staffWorkspacePath(role: string | undefined): string {
  switch (role) {
    case 'SUPPORT':
      return '/admin/support';
    case 'MARKETING_MANAGER':
      return '/admin/sms-campaigns';
    case 'MODERATOR':
      return '/admin/violations';
    default:
      return '/admin';
  }
}
