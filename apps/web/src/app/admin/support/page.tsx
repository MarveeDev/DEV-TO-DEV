'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCurrentUser } from '../../../components/Auth/CurrentUserProvider';
import {
  Badge,
  Table,
  Td,
  Pagination,
  EmptyState,
  SearchInput,
  SelectInput,
  PageHeader,
  TableSkeleton,
} from '../../../components/admin/AdminUi';
import { hasPermission } from '../../../lib/admin-permissions';
import { statusLabel, priorityLabel } from '../../../lib/support';
import type { StaffTicketSummary, StaffMeta } from '../../../lib/support-staff';

const PAGE_LIMIT = 10;
const EMPTY_META: StaffMeta = { total: 0, page: 1, limit: PAGE_LIMIT, totalPages: 1 };

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'OPEN', label: 'Open' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
];

const PRIORITY_OPTIONS = [
  { value: '', label: 'All priorities' },
  { value: 'LOW', label: 'Low' },
  { value: 'NORMAL', label: 'Normal' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

const FILTER_INPUT_STYLE: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  color: 'var(--foreground)',
  fontSize: '14px',
  outline: 'none',
};

function formatDate(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function AdminSupportPage() {
  const { user: me } = useCurrentUser();

  const [tickets, setTickets] = useState<StaffTicketSummary[]>([]);
  const [meta, setMeta] = useState<StaffMeta>(EMPTY_META);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [category, setCategory] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  const loadTickets = () => {
    const params = new URLSearchParams({ page: String(page), limit: String(PAGE_LIMIT) });
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (priority) params.append('priority', priority);
    if (category) params.append('category', category);
    if (assigneeId) params.append('assigneeId', assigneeId);

    fetch(`/api/v1/admin/support/tickets?${params.toString()}`)
      .then(async (res) => {
        if (res.status === 401) {
          setError('Your session has expired. Please sign in again.');
          setTickets([]);
          return;
        }
        if (res.status === 403) {
          setError('You do not have permission to view the Support Centre.');
          setTickets([]);
          return;
        }
        if (!res.ok) {
          setError('Unable to load tickets. Please try again.');
          setTickets([]);
          setMeta({ ...EMPTY_META, page });
          return;
        }
        const json = await res.json();
        setTickets(Array.isArray(json.data) ? json.data : []);
        setMeta(json.meta ?? { ...EMPTY_META, page });
        setError('');
      })
      .catch(() => {
        setError('Unable to load tickets. Please try again.');
        setTickets([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, status, priority, category, assigneeId]);

  if (!me || !hasPermission(me.role, 'support.manage')) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', fontWeight: 800, color: 'var(--foreground)' }}>403</div>
        <p style={{ color: 'var(--foreground-muted)', margin: '8px 0 0' }}>
          You do not have permission to access the Support Centre.
        </p>
      </div>
    );
  }

  const onSearch = (v: string) => {
    setLoading(true);
    setSearch(v);
    setPage(1);
  };
  const onStatus = (v: string) => {
    setLoading(true);
    setStatus(v);
    setPage(1);
  };
  const onPriority = (v: string) => {
    setLoading(true);
    setPriority(v);
    setPage(1);
  };
  const onCategory = (v: string) => {
    setLoading(true);
    setCategory(v);
    setPage(1);
  };
  const onAssignee = (v: string) => {
    setLoading(true);
    setAssigneeId(v);
    setPage(1);
  };
  const onPageChange = (p: number) => {
    setLoading(true);
    setPage(p);
  };

  const totalPages = meta.totalPages > 0 ? meta.totalPages : 1;

  return (
    <div>
      <PageHeader title="Support" description="Manage developer support tickets." />

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchInput value={search} onChange={onSearch} placeholder="Search subject or description..." />
        <SelectInput value={status} onChange={onStatus} options={STATUS_OPTIONS} />
        <SelectInput value={priority} onChange={onPriority} options={PRIORITY_OPTIONS} />
        <input
          type="text"
          value={category}
          onChange={(e) => onCategory(e.target.value)}
          placeholder="Filter by category"
          style={{ ...FILTER_INPUT_STYLE, maxWidth: '180px' }}
          aria-label="Filter by category"
        />
        <input
          type="text"
          value={assigneeId}
          onChange={(e) => onAssignee(e.target.value)}
          placeholder="Filter by assignee ID"
          style={{ ...FILTER_INPUT_STYLE, maxWidth: '200px' }}
          aria-label="Filter by assignee ID"
        />
      </div>

      {loading ? (
        <TableSkeleton rows={7} columns={7} />
      ) : error ? (
        <EmptyState message={error} />
      ) : tickets.length === 0 ? (
        <EmptyState message="No tickets found." />
      ) : (
        <>
          <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', margin: '0 0 12px' }}>
            {meta.total} {meta.total === 1 ? 'ticket' : 'tickets'}
          </p>
          <Table headers={['Ticket', 'Status', 'Priority', 'Reporter', 'Assignee', 'Messages', 'Updated']}>
            {tickets.map((t) => (
              <tr key={t.id}>
                <Td>
                  <Link href={`/admin/support/${t.id}`} style={{ color: 'var(--foreground)', fontWeight: 600, textDecoration: 'none' }}>
                    {t.subject}
                  </Link>
                  {t.category && (
                    <div style={{ fontSize: '12px', color: 'var(--foreground-subtle)', marginTop: '2px' }}>{t.category}</div>
                  )}
                </Td>
                <Td><Badge value={t.status} label={statusLabel(t.status)} /></Td>
                <Td><Badge value={t.priority} label={priorityLabel(t.priority)} /></Td>
                <Td>{t.reporter?.displayName || '—'}</Td>
                <Td>{t.assignee?.displayName || 'Unassigned'}</Td>
                <Td>{t.messageCount ?? 0}</Td>
                <Td>{formatDate(t.updatedAt)}</Td>
              </tr>
            ))}
          </Table>
          <Pagination page={meta.page || 1} totalPages={totalPages} onChange={onPageChange} />
        </>
      )}
    </div>
  );
}
