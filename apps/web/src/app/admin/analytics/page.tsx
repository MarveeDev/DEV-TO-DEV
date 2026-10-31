'use client';

import { useEffect, useMemo, useState } from 'react';
import { Users, FileText, HelpCircle, Store, Link2, BarChart3, BellRing } from 'lucide-react';
import { StatCard, Badge, PageHeader, EmptyState, Table, Td, SelectInput, TableSkeleton } from '../../../components/admin/AdminUi';

interface RoleCount {
  role: string;
  count: number;
}

interface TypeCount {
  type: string;
  count: number;
}

interface DayCount {
  date: string;
  count: number;
}

interface Summary {
  users: { total: number; active: number; restricted: number; suspended: number; byRole: RoleCount[] };
  content: { posts: number; comments: number; likes: number; questions: number; answers: number; projects: number };
  marketplace: { listings: number; byType: TypeCount[] };
  connections: { total: number; accepted: number };
}

interface Timeseries {
  from: string;
  to: string;
  series: { users: DayCount[]; posts: DayCount[]; questions: DayCount[]; listings: DayCount[] };
}

const RANGE_OPTIONS = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
];

const METRICS: { key: keyof Timeseries['series']; label: string }[] = [
  { key: 'users', label: 'New users' },
  { key: 'posts', label: 'Posts' },
  { key: 'questions', label: 'Questions' },
  { key: 'listings', label: 'Listings' },
];

function formatDay(v: string) {
  const d = new Date(`${v}T00:00:00`);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function BarChart({ data, label }: { data: DayCount[]; label: string }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  if (data.length === 0) {
    return <EmptyState message="No activity in this period." icon={BarChart3} />;
  }
  return (
    <div role="img" aria-label={`${label} over time`}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: 180, width: '100%' }}>
        {data.map((d) => (
          <div
            key={d.date}
            title={`${formatDay(d.date)}: ${d.count.toLocaleString()}`}
            style={{
              flex: 1,
              height: `${Math.max(2, (d.count / max) * 100)}%`,
              minWidth: '3px',
              borderRadius: '3px 3px 0 0',
              background: d.count > 0 ? 'var(--primary)' : 'var(--border)',
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: 'var(--foreground-muted)' }}>
        <span>{data[0] ? formatDay(data[0].date) : ''}</span>
        <span>{data[data.length - 1] ? formatDay(data[data.length - 1].date) : ''}</span>
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [timeseries, setTimeseries] = useState<Timeseries | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('30');
  const [metric, setMetric] = useState<keyof Timeseries['series']>('users');

  useEffect(() => {
    fetch('/api/v1/admin/analytics/summary')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load analytics');
        return res.json();
      })
      .then((data) => {
        setSummary(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const days = Number(range);
    const to = new Date();
    const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
    const fromStr = from.toISOString().slice(0, 10);
    const toStr = to.toISOString().slice(0, 10);
    fetch(`/api/v1/admin/analytics/timeseries?from=${fromStr}&to=${toStr}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load trends');
        return res.json();
      })
      .then(setTimeseries)
      .catch(() => {});
  }, [range]);

  const chartData = useMemo(() => (timeseries ? timeseries.series[metric] : []), [timeseries, metric]);

  if (error) return <EmptyState message={error} icon={BellRing} />;
  if (loading || !summary) {
    return (
      <div style={{ display: 'grid', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 18, height: 110 }} />
          ))}
        </div>
        <TableSkeleton rows={4} columns={3} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Platform growth and engagement across accounts, content, marketplace, and connections."
        actions={
          <SelectInput
            value={range}
            onChange={setRange}
            options={RANGE_OPTIONS}
          />
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatCard label="Total users" value={summary.users.total.toLocaleString()} icon={Users} tone="blue" sub={`${summary.users.active.toLocaleString()} active`} />
        <StatCard label="Posts" value={summary.content.posts.toLocaleString()} icon={FileText} tone="purple" sub={`${summary.content.likes.toLocaleString()} likes`} />
        <StatCard label="Questions" value={summary.content.questions.toLocaleString()} icon={HelpCircle} tone="green" sub={`${summary.content.answers.toLocaleString()} answers`} />
        <StatCard label="Listings" value={summary.marketplace.listings.toLocaleString()} icon={Store} tone="amber" />
        <StatCard label="Connections" value={summary.connections.total.toLocaleString()} icon={Link2} tone="blue" sub={`${summary.connections.accepted.toLocaleString()} accepted`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>Growth trend</h2>
            <SelectInput
              value={metric}
              onChange={(v) => setMetric(v as keyof Timeseries['series'])}
              options={METRICS.map((m) => ({ value: m.key, label: m.label }))}
            />
          </div>
          <BarChart data={chartData} label={METRICS.find((m) => m.key === metric)?.label ?? metric} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 12px' }}>Accounts by role</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {summary.users.byRole.length === 0 ? (
                <span style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>No accounts yet.</span>
              ) : (
                summary.users.byRole.map((r) => <Badge key={r.role} value={r.role} label={`${r.role}: ${r.count}`} />)
              )}
            </div>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 12px' }}>Listings by type</h2>
            <Table headers={['Type', 'Count']}>
              {summary.marketplace.byType.length === 0 ? (
                <tr>
                  <Td colSpan={2}>No listings yet.</Td>
                </tr>
              ) : (
                summary.marketplace.byType.map((t) => (
                  <tr key={t.type}>
                    <Td>{t.type}</Td>
                    <Td>{t.count.toLocaleString()}</Td>
                  </tr>
                ))
              )}
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
