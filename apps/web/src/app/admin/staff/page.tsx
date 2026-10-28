'use client';

import { useEffect, useState } from 'react';
import { Badge, Table, Td, Pagination, EmptyState, SearchInput, SelectInput, PageHeader, TableSkeleton } from '../../../components/admin/AdminUi';
import Avatar from '../../../components/Avatar';
import { useCurrentUser } from '../../../components/Auth/CurrentUserProvider';
import { hasPermission, canAssignRole, STAFF_ROLES, type AdminRole } from '../../../lib/admin-permissions';

const ALL_ROLES: AdminRole[] = ['USER', 'MODERATOR', 'ANALYTICS_VIEWER', 'SUPPORT', 'MARKETING_MANAGER', 'PLATFORM_ADMIN', 'ADMIN', 'SUPER_ADMIN'];

function formatDate(v?: string | null) {
  if (!v) return '—';
  return new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function AdminStaffPage() {
  const { user: me } = useCurrentUser();
  const canManageStaff = hasPermission(me?.role, 'staff.manage');
  const canManageUsers = hasPermission(me?.role, 'users.manage');

  const [staff, setStaff] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const [invites, setInvites] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<AdminRole>('MODERATOR');
  const [inviteError, setInviteError] = useState('');
  const [inviteBusy, setInviteBusy] = useState(false);

  const loadStaff = () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (search) params.append('search', search);
    if (roleFilter) params.append('role', roleFilter);
    fetch(`/api/v1/admin/staff?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : { items: [], meta: {} }))
      .then((data) => {
        setStaff(data.items || []);
        setMeta(data.meta || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const loadInvites = () => {
    if (!canManageStaff) return;
    fetch('/api/v1/admin/staff/invites')
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => setInvites(data.items || []))
      .catch(() => {});
  };

  useEffect(() => {
    loadStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, roleFilter]);

  useEffect(() => {
    loadInvites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canManageStaff]);

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviteBusy(true);
    setInviteError('');
    try {
      const res = await fetch('/api/v1/admin/staff/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole }),
      });
      if (res.ok) {
        setInviteEmail('');
        loadInvites();
      } else {
        const err = await res.json().catch(() => ({}));
        setInviteError(err.message || 'Failed to send invite');
      }
    } catch {
      setInviteError('Failed to send invite');
    } finally {
      setInviteBusy(false);
    }
  };

  const revokeInvite = async (id: string) => {
    if (!window.confirm('Revoke this pending invite?')) return;
    const res = await fetch(`/api/v1/admin/staff/invites/${id}`, { method: 'DELETE' });
    if (res.ok) loadInvites();
  };

  const changeRole = async (id: string, newRole: string) => {
    if (!window.confirm(`Change this staff member's role to ${newRole}?`)) return;
    const res = await fetch(`/api/v1/admin/users/${id}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      setStaff((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.message || 'Failed to change role');
    }
  };

  const changeStatus = async (id: string, status: 'ACTIVE' | 'SUSPENDED') => {
    const verb = status === 'SUSPENDED' ? 'deactivate' : 'reactivate';
    if (!window.confirm(`Are you sure you want to ${verb} this staff account?`)) return;
    const res = await fetch(`/api/v1/admin/staff/users/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setStaff((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.message || 'Failed to update account status');
    }
  };

  return (
    <div>
      <PageHeader title="Staff" description="Manage staff accounts, roles, and invitations." />

      {canManageStaff && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 4px' }}>Invite a staff member</h2>
          <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', margin: '0 0 16px' }}>
            The invitee signs in with their existing GitHub or Google account; their role is granted automatically on first sign-in.
          </p>
          <form onSubmit={invite} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="email@example.com"
              style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '14px', minWidth: '260px' }}
            />
            <SelectInput
              value={inviteRole}
              onChange={(v) => setInviteRole(v as AdminRole)}
              options={STAFF_ROLES.map((r) => ({ value: r, label: r }))}
            />
            <button type="submit" disabled={inviteBusy} style={{ padding: '10px 18px', borderRadius: 'var(--radius-md)', background: 'var(--primary)', color: '#fff', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer', opacity: inviteBusy ? 0.7 : 1 }}>
              {inviteBusy ? 'Inviting...' : 'Send Invite'}
            </button>
          </form>
          {inviteError && <p style={{ color: '#ef4444', fontSize: '13px', margin: '12px 0 0' }}>{inviteError}</p>}

          {invites.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 8px' }}>Pending invites</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                {invites.map((inv) => (
                  <div key={inv.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--background)' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{inv.email}</div>
                      <div style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>{inv.role} · {inv.status}</div>
                    </div>
                    {inv.status === 'PENDING' && (
                      <button onClick={() => revokeInvite(inv.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Revoke</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name, username, or email..." />
        <SelectInput value={roleFilter} onChange={setRoleFilter} options={[{ value: '', label: 'All roles' }, ...ALL_ROLES.map((r) => ({ value: r, label: r }))]} />
      </div>

      {loading ? (
        <TableSkeleton rows={7} columns={6} />
      ) : staff.length === 0 ? (
        <EmptyState message="No staff accounts found." />
      ) : (
        <>
          <Table headers={['Staff', 'Email', 'Role', 'Status', 'Joined', 'Actions']}>
            {staff.map((u) => (
              <tr key={u.id}>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar src={u.developerProfile?.avatarUrl} name={u.developerProfile?.displayName || u.email} size={34} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600 }}>{u.developerProfile?.displayName || '—'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>
                        {u.developerProfile?.username ? `@${u.developerProfile.username}` : ''}
                      </div>
                    </div>
                  </div>
                </Td>
                <Td>{u.email}</Td>
                <Td>
                  {canManageUsers ? (
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '13px' }}
                    >
                      {ALL_ROLES.filter((r) => r === u.role || canAssignRole(me?.role, r)).map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  ) : (
                    <Badge value={u.role} />
                  )}
                </Td>
                <Td><Badge value={u.status} /></Td>
                <Td>{formatDate(u.createdAt)}</Td>
                <Td>
                  {canManageUsers && u.id !== me?.id && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {u.status === 'ACTIVE' ? (
                        <button onClick={() => changeStatus(u.id, 'SUSPENDED')} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Deactivate</button>
                      ) : (
                        <button onClick={() => changeStatus(u.id, 'ACTIVE')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Reactivate</button>
                      )}
                    </div>
                  )}
                </Td>
              </tr>
            ))}
          </Table>
          <Pagination page={meta.page || 1} totalPages={meta.totalPages || 1} onChange={setPage} />
        </>
      )}
    </div>
  );
}
