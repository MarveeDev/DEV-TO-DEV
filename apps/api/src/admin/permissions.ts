import { UserRole } from '@prisma/client';

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

export const STAFF_ROLES: UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'PLATFORM_ADMIN',
  'MODERATOR',
  'MARKETING_MANAGER',
  'SUPPORT',
  'ANALYTICS_VIEWER',
];

export const ALL_PERMISSIONS: AdminPermission[] = [
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
];

export const ROLE_RANK: Record<UserRole, number> = {
  USER: 0,
  ANALYTICS_VIEWER: 1,
  SUPPORT: 2,
  MARKETING_MANAGER: 3,
  MODERATOR: 4,
  PLATFORM_ADMIN: 5,
  ADMIN: 6,
  SUPER_ADMIN: 7,
};

export const PERMISSIONS: Record<UserRole, AdminPermission[]> = {
  USER: [],
  ANALYTICS_VIEWER: ['overview.view', 'analytics.view'],
  SUPPORT: ['overview.view', 'analytics.view', 'support.manage'],
  MARKETING_MANAGER: ['overview.view', 'analytics.view'],
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

export function hasPermission(role: UserRole, permission: AdminPermission): boolean {
  return (PERMISSIONS[role] ?? []).includes(permission);
}

/**
 * Explicit role hierarchy for the legacy `@Roles` guard. A role "covers" a
 * required role only when it is that role or a role that semantically implies
 * it. Sibling roles (MODERATOR, MARKETING_MANAGER, SUPPORT, ANALYTICS_VIEWER)
 * deliberately do not imply one another.
 */
const ROLE_IMPLIES: Partial<Record<UserRole, UserRole[]>> = {
  SUPER_ADMIN: ['ADMIN', 'MODERATOR'],
  ADMIN: ['MODERATOR'],
  PLATFORM_ADMIN: ['MODERATOR'],
};

export function roleCovers(role: UserRole, required: UserRole): boolean {
  if (role === required) return true;
  return (ROLE_IMPLIES[role] ?? []).includes(required);
}

/**
 * Whether `actor` may assign `role` (or manage a user currently holding
 * `role`). SUPER_ADMIN may manage everything; every other role may only manage
 * strictly lower-ranked roles, which prevents upward and lateral escalation.
 */
export function canAssignRole(actor: UserRole, role: UserRole): boolean {
  if (actor === 'SUPER_ADMIN') return true;
  return (ROLE_RANK[actor] ?? 0) > (ROLE_RANK[role] ?? 0);
}

/** Postgres advisory-lock key used to serialize administrative role changes. */
export const ADMIN_ROLE_LOCK_KEY = 727405;

