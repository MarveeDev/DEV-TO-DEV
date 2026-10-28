'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Card from '../../components/Card';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import Skeleton from '../../components/Skeleton';
import BackButton from '../../components/Navigation/BackButton';
import { StatusBadge, PriorityBadge } from '../../components/SupportBadges';
import { useRequireAuth } from '../../components/Auth/useRequireAuth';
import { LifeBuoy, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  extractErrorMessage,
  type DeveloperTicketSummary,
  type SupportMeta,
  type TicketListResponse,
} from '../../lib/support';

const PAGE_LIMIT = 10;
const EMPTY_META: SupportMeta = { total: 0, page: 1, limit: PAGE_LIMIT, totalPages: 1 };

function formatDate(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function SupportListClient() {
  const router = useRouter();
  const { loading: authLoading, isAuthenticated } = useRequireAuth('/login');

  const [tickets, setTickets] = useState<DeveloperTicketSummary[]>([]);
  const [meta, setMeta] = useState<SupportMeta>(EMPTY_META);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadTickets = (pageToLoad: number) => {
    fetch(`/api/v1/support/tickets?page=${pageToLoad}&limit=${PAGE_LIMIT}`)
      .then(async (res) => {
        if (res.status === 401) {
          router.replace('/login');
          return;
        }
        if (!res.ok) {
          setListError('Unable to load your tickets. Please try again.');
          setTickets([]);
          setMeta({ ...EMPTY_META, page: pageToLoad });
          return;
        }
        const json = (await res.json()) as TicketListResponse;
        setTickets(Array.isArray(json.data) ? json.data : []);
        setMeta(json.meta ?? { ...EMPTY_META, page: pageToLoad });
        setListError('');
      })
      .catch(() => {
        setListError('Unable to load your tickets. Please try again.');
        setTickets([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    loadTickets(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated, page]);

  const goToPage = (next: number) => {
    if (next === page || next < 1) return;
    setLoading(true);
    setPage(next);
  };

  const openForm = () => {
    setFormError('');
    setSuccess('');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSubject = subject.trim();
    const trimmedDescription = description.trim();
    const trimmedCategory = category.trim();

    if (!trimmedSubject) {
      setFormError('Please enter a subject.');
      return;
    }
    if (!trimmedDescription) {
      setFormError('Please describe your issue.');
      return;
    }

    setSubmitting(true);
    setFormError('');
    setSuccess('');
    try {
      const res = await fetch('/api/v1/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: trimmedSubject,
          description: trimmedDescription,
          category: trimmedCategory || undefined,
        }),
      });

      if (res.status === 401) {
        router.replace('/login');
        return;
      }

      const body = await res.json().catch(() => null);

      if (res.status === 429) {
        setFormError(
          extractErrorMessage(body) ??
            'You have created too many tickets recently. Please try again later.',
        );
        return;
      }

      if (!res.ok) {
        setFormError(extractErrorMessage(body) ?? 'Unable to create your ticket. Please try again.');
        return;
      }

      setSubject('');
      setDescription('');
      setCategory('');
      setShowForm(false);
      setSuccess('Your ticket has been created. Our team will get back to you.');
      setLoading(true);
      if (page === 1) {
        loadTickets(1);
      } else {
        setPage(1);
      }
    } catch {
      setFormError('Unable to create your ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <Skeleton width="60%" maxWidth={320} height={30} style={{ marginBottom: '12px' }} />
        <Skeleton width="40%" maxWidth={220} height={14} />
      </div>
    );
  }

  const totalPages = meta.totalPages > 0 ? meta.totalPages : 1;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      {/* Header */}
      <section className="section-header" style={{ alignItems: 'flex-start' }}>
        <div className="page-header">
          <BackButton fallback="/dashboard" />
          <div className="page-header-content">
            <h1 className="text-wrap-safe" style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '0 0 8px 0' }}>
              <LifeBuoy size={28} color="var(--primary)" />
              Support
            </h1>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '16px', margin: 0 }}>
              Need help? Submit a ticket and track your enquiries.
            </p>
          </div>
        </div>
        <Button variant="primary" onClick={openForm}>
          <Plus size={16} />
          New Ticket
        </Button>
      </section>

      {/* Success banner */}
      {success && !showForm && (
        <div
          role="status"
          style={{
            background: 'var(--success-light)',
            color: 'var(--success)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            border: '1px solid var(--success)',
          }}
        >
          {success}
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <Card padding="lg">
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px', color: 'var(--foreground)' }}>
            Create a support ticket
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--foreground-muted)', margin: '0 0 20px' }}>
            Tell us what you need help with and we will get back to you as soon as possible.
          </p>

          {formError && (
            <div
              role="alert"
              style={{
                background: 'var(--danger-light)',
                color: 'var(--danger)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                fontSize: '14px',
                border: '1px solid var(--danger)',
              }}
            >
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="support-subject" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>
                Subject <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                id="support-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={200}
                placeholder="Briefly summarise your issue"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="support-description" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>
                Description <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <textarea
                id="support-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={5000}
                placeholder="Provide as much detail as possible so we can help you quickly..."
                style={{
                  width: '100%',
                  minHeight: '160px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  fontSize: '15px',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="support-category" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>
                Category <span style={{ fontSize: '13px', color: 'var(--foreground-subtle)', fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                id="support-category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                maxLength={100}
                placeholder="e.g. Billing, Bug report, Account"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button variant="outline" type="button" onClick={() => setShowForm(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Ticket'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* List */}
      {loading ? (
        <div role="status" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span className="sr-only">Loading tickets…</span>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} padding="md" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Skeleton width="50%" height={18} />
              <Skeleton width="80%" height={13} />
              <Skeleton width="30%" height={13} />
            </Card>
          ))}
        </div>
      ) : listError ? (
        <EmptyState
          icon={LifeBuoy}
          title="Something went wrong"
          description={listError}
          action={
            <Button variant="primary" onClick={() => { setLoading(true); loadTickets(page); }}>
              Try Again
            </Button>
          }
        />
      ) : tickets.length === 0 ? (
        <EmptyState
          icon={LifeBuoy}
          title="No tickets yet"
          description="When you need help, create a ticket and our support team will assist you."
          action={
            <Button variant="primary" onClick={openForm}>
              <Plus size={16} />
              Create a Ticket
            </Button>
          }
        />
      ) : (
        <>
          <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', margin: 0 }}>
            {meta.total} {meta.total === 1 ? 'ticket' : 'tickets'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tickets.map((ticket) => (
              <Link key={ticket.id} href={`/support/${ticket.id}`} style={{ textDecoration: 'none' }}>
                <Card padding="md" className="hover-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', margin: 0, lineHeight: 1.4, overflowWrap: 'anywhere' }}>
                      {ticket.subject}
                    </h3>
                    <StatusBadge value={ticket.status} />
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                    <PriorityBadge value={ticket.priority} />
                    {ticket.category && (
                      <span
                        style={{
                          fontSize: '12px',
                          color: 'var(--foreground-muted)',
                          background: 'var(--surface-hover)',
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: 600,
                        }}
                      >
                        {ticket.category}
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '13px', color: 'var(--foreground-subtle)' }}>
                    Created {formatDate(ticket.createdAt) || '—'}
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
                <ChevronLeft size={15} />
                Previous
              </Button>
              <span style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>
                Page {page} of {totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>
                Next
                <ChevronRight size={15} />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
