import { hasPermission, roleCovers, canAssignRole, STAFF_ROLES, staffWorkspacePath } from './permissions';

describe('admin permissions matrix', () => {
  it('grants SUPER_ADMIN every permission including staff management', () => {
    expect(hasPermission('SUPER_ADMIN', 'staff.manage')).toBe(true);
    expect(hasPermission('SUPER_ADMIN', 'users.manage')).toBe(true);
    expect(hasPermission('SUPER_ADMIN', 'audit.view')).toBe(true);
  });

  it('denies staff management to ADMIN and PLATFORM_ADMIN', () => {
    expect(hasPermission('ADMIN', 'staff.manage')).toBe(false);
    expect(hasPermission('PLATFORM_ADMIN', 'staff.manage')).toBe(false);
  });

  it('scopes roles by least privilege', () => {
    expect(hasPermission('MODERATOR', 'content.moderate')).toBe(true);
    expect(hasPermission('MODERATOR', 'users.manage')).toBe(false);
    expect(hasPermission('MODERATOR', 'audit.view')).toBe(false);
    expect(hasPermission('ANALYTICS_VIEWER', 'analytics.view')).toBe(true);
    expect(hasPermission('ANALYTICS_VIEWER', 'users.view')).toBe(false);
    expect(hasPermission('USER', 'overview.view')).toBe(false);
  });

  it('grants marketing to MARKETING_MANAGER and ADMIN without broadening privileges', () => {
    expect(hasPermission('MARKETING_MANAGER', 'marketing.manage')).toBe(true);
    expect(hasPermission('ADMIN', 'marketing.manage')).toBe(true);
    expect(hasPermission('MARKETING_MANAGER', 'users.manage')).toBe(false);
    expect(hasPermission('MARKETING_MANAGER', 'staff.manage')).toBe(false);
    expect(hasPermission('MARKETING_MANAGER', 'support.manage')).toBe(false);
    expect(hasPermission('MARKETING_MANAGER', 'audit.view')).toBe(false);
  });

  it('scopes SUPPORT to support.manage only (no unrelated admin access)', () => {
    expect(hasPermission('SUPPORT', 'support.manage')).toBe(true);
    expect(hasPermission('SUPPORT', 'users.manage')).toBe(false);
    expect(hasPermission('SUPPORT', 'staff.manage')).toBe(false);
    expect(hasPermission('SUPPORT', 'audit.view')).toBe(false);
    expect(hasPermission('SUPPORT', 'marketing.manage')).toBe(false);
  });

  it('orders roles for the legacy @Roles hierarchy without leaking sibling roles', () => {
    expect(roleCovers('SUPER_ADMIN', 'ADMIN')).toBe(true);
    expect(roleCovers('ADMIN', 'MODERATOR')).toBe(true);
    expect(roleCovers('PLATFORM_ADMIN', 'MODERATOR')).toBe(true);
    expect(roleCovers('PLATFORM_ADMIN', 'ADMIN')).toBe(false);
    expect(roleCovers('MODERATOR', 'ADMIN')).toBe(false);
    expect(roleCovers('MODERATOR', 'SUPPORT')).toBe(false);
    expect(roleCovers('MODERATOR', 'MARKETING_MANAGER')).toBe(false);
    expect(roleCovers('MODERATOR', 'ANALYTICS_VIEWER')).toBe(false);
  });

  it('prevents upward and lateral role assignment', () => {
    expect(canAssignRole('SUPER_ADMIN', 'SUPER_ADMIN')).toBe(true);
    expect(canAssignRole('SUPER_ADMIN', 'ADMIN')).toBe(true);
    expect(canAssignRole('ADMIN', 'PLATFORM_ADMIN')).toBe(true);
    expect(canAssignRole('ADMIN', 'ADMIN')).toBe(false);
    expect(canAssignRole('ADMIN', 'SUPER_ADMIN')).toBe(false);
    expect(canAssignRole('PLATFORM_ADMIN', 'MODERATOR')).toBe(true);
    expect(canAssignRole('PLATFORM_ADMIN', 'PLATFORM_ADMIN')).toBe(false);
    expect(canAssignRole('PLATFORM_ADMIN', 'ADMIN')).toBe(false);
    expect(canAssignRole('PLATFORM_ADMIN', 'SUPER_ADMIN')).toBe(false);
  });

  it('lists all target staff roles', () => {
    expect(STAFF_ROLES).toEqual(
      expect.arrayContaining([
        'SUPER_ADMIN',
        'ADMIN',
        'PLATFORM_ADMIN',
        'MARKETING_MANAGER',
        'SUPPORT',
        'MODERATOR',
        'ANALYTICS_VIEWER',
      ]),
    );
  });

  it('maps each staff role to its default workspace', () => {
    expect(staffWorkspacePath('SUPER_ADMIN')).toBe('/admin');
    expect(staffWorkspacePath('ADMIN')).toBe('/admin');
    expect(staffWorkspacePath('PLATFORM_ADMIN')).toBe('/admin');
    expect(staffWorkspacePath('MARKETING_MANAGER')).toBe('/admin/sms-campaigns');
    expect(staffWorkspacePath('SUPPORT')).toBe('/admin/support');
    expect(staffWorkspacePath('MODERATOR')).toBe('/admin/violations');
    expect(staffWorkspacePath('ANALYTICS_VIEWER')).toBe('/admin');
  });
});
