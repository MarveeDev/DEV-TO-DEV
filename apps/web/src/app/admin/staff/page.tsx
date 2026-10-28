'use client';

import { useEffect, useState } from 'react';
import { Badge, Table, Td, Pagination, EmptyState, SearchInput, SelectInput, PageHeader, TableSkeleton } from '../../../components/admin/AdminUi';
import Avatar from '../../../components/Avatar';
import { useCurrentUser } from '../../../components/Auth/CurrentUserProvider';
import { hasPermission, canAssignRole, STAFF_ROLES, type AdminRole } from '../../../lib/admin-permissions';

const ALL_ROLES: AdminRole[] = ['USER', 'MODERATOR', 'ANALYTICS_VIEWER', 'SUPPORT', 'MARKETING_MANAGER', 'PLATFORM_ADMIN', 'ADMIN', 'SUPER_ADMIN'];

interface StaffItem {
  id: string;
  email: string | null;
  role: string;
  status: string;
  createdAt: string;
  developerProfile?: { username?: string | null; displayName?: string | null; avatarUrl?: string | null } | null;
}

interface InviteItem {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  status: string;
  createdAt?: string;
  acceptedAt?: string | null;
  expiresAt?: string | null;
}

function formatDate(v?: string | null) {
  if (!v) return '—';
  return new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function AdminStaffPage() {
  const { user: me } = useCurrentUser();
  const canManageStaff = hasPermission(me?.role, 'staff.manage');
  const canManageUsers = hasPermission(me?.role, 'users.manage');

  const [staff, setStaff] = useState<StaffItem[]>([]);
  const [meta, setMeta] = useState<{ page?: number; totalPages?: number }>({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const [invites, setInvites] = useState<InviteItem[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<AdminRole>('MODERATOR');
  const [inviteError, setInviteError] = useState('');
  const [inviteBusy, setInviteBusy] = useState(false);

  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error' | 'warning'; text: string } | null>(null);

  const assignableRoles = STAFF_ROLES.filter((r) => canAssignRole(me?.role, r));

  const loadStaff = () => {
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (search) params.append('search', search);
    if (roleFilter) params.append('role', roleFilter);
    fetch(`/api/v1/admin/staff?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : { items: [], meta: {} }))
      .then((data) => {
        setStaff(data.items || []);
        setMeta(data.meta || {});
      })
      .catch(() => {})
      .finally(() => setLoading(false));
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

  const onSearch = (v: string) => {
    setLoading(true);
    setSearch(v);
  };
  const onRoleFilter = (v: string) => {
    setLoading(true);
    setRoleFilter(v);
  };
  const onPageChange = (p: number) => {
    setLoading(true);
    setPage(p);
  };

  const openModal = () => {
    setInviteName('');
    setInviteEmail('');
    setInviteRole('MODERATOR');
    setInviteError('');
    setShowModal(true);
  };

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = inviteEmail.trim();
    if (!email) return;

    setInviteBusy(true);
    setInviteError('');
    try {
      const res = await fetch('/api/v1/admin/staff/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: inviteName.trim() || undefined, email, role: inviteRole }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setShowModal(false);
        loadInvites();
        if (data.emailSent) {
          setFeedback({ kind: 'success', text: `Invitation sent to ${email}.` });
        } else {
          setFeedback({ kind: 'warning', text: `Invitation created for ${email}, but the email could not be sent. Use "Resend" once email is configured.` });
        }
      } else {
        setInviteError(data.message || 'Failed to send invite');
      }
    } catch {
      setInviteError('Failed to send invite');
    } finally {
      setInviteBusy(false);
    }
  };

  const resendInvite = async (id: string, email: string) => {
    setFeedback(null);
    const res = await fetch(`/api/v1/admin/staff/invites/${id}/resend`, { method: 'POST' });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setFeedback(data.emailSent
        ? { kind: 'success', text: `Invitation resent to ${email}.` }
        : { kind: 'warning', text: `Invitation was updated, but the email could not be sent.` });
      loadInvites();
    } else {
      setFeedback({ kind: 'error', text: data.message || 'Failed to resend invite' });
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

  const feedbackTone = feedback?.kind === 'success' ? 'var(--success)' : feedback?.kind === 'warning' ? 'var(--warning)' : 'var(--danger)';

  return (
    <div>
      <PageHeader
        title="Staff"
        description="Manage staff accounts, roles, and invitations."
        actions={canManageStaff ? (
          <button onClick={openModal} style={{ padding: '10px 18px', borderRadius: 10, background: 'var(--primary)', color: '#fff', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer' }}>
            Add Staff
          </button>
        ) : undefined}
      />

      {feedback && (
        <div role="status" style={{ padding: '12px 16px', borderRadius: 10, marginBottom: '16px', fontSize: '14px', background: feedback.kind === 'success' ? 'var(--success-light)' : feedback.kind === 'warning' ? 'var(--warning-light)' : 'var(--danger-light)', color: feedbackTone, border: `1px solid ${feedbackTone}` }}>
          {feedback.text}
        </div>
      )}

      {canManageStaff && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 4px' }}>Invitations</h2>
          <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', margin: '0 0 16px' }}>
            Invite a staff member by email. They will receive an activation link to set their own password.
          </p>

          {invites.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', margin: 0 }}>No invitations yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {invites.map((inv) => (
                <div key={inv.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--background)' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{inv.name || inv.email}</div>
                    <div style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>{inv.email}</div>
                    <div style={{ fontSize: '12px', color: 'var(--foreground-subtle)', marginTop: '2px' }}>
                      {inv.role} · {inv.status}{inv.status === 'PENDING' && inv.expiresAt ? ` · expires ${formatDate(inv.expiresAt)}` : ''}
                    </div>
                  </div>
                  {inv.status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <button onClick={() => resendInvite(inv.id, inv.email)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Resend</button>
                      <button onClick={() => revokeInvite(inv.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Revoke</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <SearchInput value={search} onChange={onSearch} placeholder="Search by name, username, or email..." />
        <SelectInput value={roleFilter} onChange={onRoleFilter} options={[{ value: '', label: 'All roles' }, ...ALL_ROLES.map((r) => ({ value: r, label: r }))]} />
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
          <Pagination page={meta.page || 1} totalPages={meta.totalPages || 1} onChange={onPageChange} />
        </>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(2, 6, 16, 0.65)' }} onClick={() => setShowModal(false)} />
          <div style={{ position: 'relative', width: '100%', maxWidth: '460px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px', boxShadow: 'var(--shadow-lg)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 4px' }}>Add Staff</h2>
            <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', margin: '0 0 20px' }}>
              The staff member will receive an email with an activation link to set their own password.
            </p>

            {inviteError && (
              <div role="alert" style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '12px 16px', borderRadius: 10, marginBottom: '16px', fontSize: '14px', border: '1px solid var(--danger)' }}>
                {inviteError}
              </div>
            )}

            <form onSubmit={invite} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="invite-name" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>Full name</label>
                <input
                  id="invite-name"
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  maxLength={120}
                  placeholder="e.g. Jane Doe"
                  style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="invite-email" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>Email address *</label>
                <input
                  id="invite-email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                  style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="invite-role" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>Role</label>
                <SelectInput
                  value={inviteRole}
                  onChange={(v) => setInviteRole(v as AdminRole)}
                  options={assignableRoles.map((r) => ({ value: r, label: r }))}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} disabled={inviteBusy} style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--foreground-muted)', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={inviteBusy} style={{ padding: '10px 18px', borderRadius: 10, background: 'var(--primary)', color: '#fff', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer', opacity: inviteBusy ? 0.7 : 1 }}>
                  {inviteBusy ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
