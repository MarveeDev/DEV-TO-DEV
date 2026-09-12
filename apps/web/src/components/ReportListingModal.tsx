'use client';

import { useState } from 'react';
import Button from './Button';

const REASONS: { value: string; label: string }[] = [
  { value: 'SCAM_FRAUD', label: 'Scam / Fraud' },
  { value: 'MISLEADING_INFORMATION', label: 'Misleading information' },
  { value: 'COPYRIGHT_INFRINGEMENT', label: 'Copyright infringement' },
  { value: 'PROHIBITED_ITEM', label: 'Prohibited item/service' },
  { value: 'SPAM', label: 'Spam' },
  { value: 'HARASSMENT_ABUSE', label: 'Harassment / Abuse' },
  { value: 'MALICIOUS_CODE', label: 'Malicious code/file' },
  { value: 'OTHER', label: 'Other' },
];

export default function ReportListingModal({
  listingId,
  onClose,
}: {
  listingId: string;
  onClose: () => void;
}) {
  const [reason, setReason] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!reason || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`/api/v1/marketplace/listings/${listingId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, description: description.trim() || undefined }),
      });
      if (res.status === 401) {
        setError('You must be logged in to report a listing.');
        setSubmitting(false);
        return;
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.message || 'Unable to submit report. Please try again.');
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '480px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        }}
      >
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '12px' }}>
              Report submitted
            </div>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '15px', lineHeight: 1.5, margin: '0 0 24px 0' }}>
              Report submitted. Thank you for helping keep DEV-TO-DEV safe.
            </p>
            <Button variant="primary" onClick={onClose}>Done</Button>
          </div>
        ) : (
          <>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '4px' }}>
              Report this listing
            </div>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '14px', margin: '0 0 20px 0' }}>
              Why are you reporting this?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {REASONS.map((r) => {
                const selected = reason === r.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setReason(r.value)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
                      background: selected ? 'var(--primary-light)' : 'var(--background)',
                      color: 'var(--foreground)',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                    }}
                  >
                    <span
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: `2px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
                        background: selected ? 'var(--primary)' : 'transparent',
                        flexShrink: 0,
                      }}
                    />
                    {r.label}
                  </button>
                );
              })}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--foreground-muted)', marginBottom: '8px' }}>
                Tell us more (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add any additional details..."
                style={{
                  width: '100%',
                  minHeight: '80px',
                  resize: 'vertical',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {error && (
              <div style={{ padding: '10px 12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: 'var(--radius-sm)', fontSize: '13px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
              <Button variant="primary" onClick={handleSubmit} disabled={!reason || submitting}>
                {submitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
