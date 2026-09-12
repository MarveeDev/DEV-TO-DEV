'use client';

import { useEffect, useState } from 'react';
import { Badge, Table, Td, Pagination, EmptyState, SearchInput, SelectInput } from '../../../components/admin/AdminUi';

function formatDate(v: string) {
  if (!v) return '—';
  return new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((me) => setIsAdmin(me?.role === 'ADMIN'))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (search) params.append('search', search);
    if (role) params.append('role', role);
    fetch(`/api/v1/admin/users?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : { items: [], meta: {} }))
      .then((data) => {
        setUsers(data.items || []);
        setMeta(data.meta || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, search, role]);

  const changeRole = async (id: string, newRole: string) => {
    if (!window.confirm(`Change this user's role to ${newRole}?`)) return;
    const res = await fetch(`/api/v1/admin/users/${id}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.message || 'Failed to change role');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name, username, or email..." />
        <SelectInput
          value={role}
          onChange={setRole}
          options={[
            { value: '', label: 'All roles' },
            { value: 'USER', label: 'USER' },
            { value: 'MODERATOR', label: 'MODERATOR' },
            { value: 'ADMIN', label: 'ADMIN' },
          ]}
        />
      </div>

      {loading ? (
        <EmptyState message="Loading users..." />
      ) : users.length === 0 ? (
        <EmptyState message="No users found." />
      ) : (
        <>
          <Table headers={['User', 'Email', 'Role', 'Status', 'Posts', 'Joined']}>
            {users.map((u) => (
              <tr key={u.id}>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {u.developerProfile?.avatarUrl ? (
                      <img src={u.developerProfile.avatarUrl} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--border)' }} />
                    )}
                    <div>
                      <div style={{ fontWeight: 600 }}>{u.developerProfile?.displayName || '—'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>
                        {u.developerProfile?.username ? `@${u.developerProfile.username}` : ''}
                      </div>
                    </div>
                  </div>
                </Td>
                <Td>{u.email}</Td>
                <Td>
                  {isAdmin ? (
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '13px' }}
                    >
                      <option value="USER">USER</option>
                      <option value="MODERATOR">MODERATOR</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  ) : (
                    <Badge value={u.role} />
                  )}
                </Td>
                <Td><Badge value={u.status} /></Td>
                <Td>{u._count?.posts ?? 0}</Td>
                <Td>{formatDate(u.createdAt)}</Td>
              </tr>
            ))}
          </Table>
          <Pagination page={meta.page || 1} totalPages={meta.totalPages || 1} onChange={setPage} />
        </>
      )}
    </div>
  );
}
