'use client';

import { useEffect, useRef, useState } from 'react';
import Card from './Card';
import Button from './Button';
import { useCurrentUser } from './Auth/CurrentUserProvider';

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  background: 'var(--surface)',
  color: 'var(--foreground)',
  fontSize: '14px',
  outline: 'none',
};

const labelStyle = {
  display: 'block',
  fontWeight: 600,
  marginBottom: '6px',
  fontSize: '14px',
  color: 'var(--foreground)',
};

export default function PhoneVerification() {
  const { user, refreshUser } = useCurrentUser();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState<'idle' | 'sent'>('idle');
  const [countdown, setCountdown] = useState(0);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const verified = Boolean(user?.phoneNumber && user?.phoneVerifiedAt);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCountdown = (seconds: number) => {
    setCountdown(seconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const handleSend = async () => {
    setMessage(null);
    setSending(true);
    try {
      const res = await fetch('/api/v1/profile/phone/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        setStage('sent');
        setOtp('');
        startCountdown(data?.resendAfterSeconds ?? 60);
        setMessage({ type: 'success', text: 'Verification code sent.' });
      } else {
        setMessage({
          type: 'error',
          text: data?.message || 'Failed to send code.',
        });
      }
    } catch {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    setMessage(null);
    setVerifying(true);
    try {
      const res = await fetch('/api/v1/profile/phone/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        setStage('idle');
        setOtp('');
        setPhone('');
        setMessage({ type: 'success', text: 'Phone number verified successfully!' });
        await refreshUser();
      } else {
        setMessage({
          type: 'error',
          text: data?.message || 'Invalid verification code.',
        });
      }
    } catch {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Card padding="lg">
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Phone Verification</h2>
        <p style={{ color: 'var(--foreground-muted)', fontSize: '14px', margin: '8px 0 0' }}>
          {verified
            ? `Verified number: ${user?.phoneNumber}`
            : 'Verify your phone number to secure your account.'}
        </p>
      </div>

      {message && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: message.type === 'success' ? '#15803d' : '#b91c1c',
            border: message.type === 'success' ? '1px solid #bbf7d0' : '1px solid #fecaca',
          }}
        >
          {message.text}
        </div>
      )}

      {stage === 'idle' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
              placeholder="+1 415 555 2671"
            />
          </div>
          <div>
            <Button onClick={handleSend} disabled={sending || !phone.trim()}>
              {sending ? 'Sending...' : 'Send Verification Code'}
            </Button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Verification Code</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              style={inputStyle}
              placeholder="6-digit code"
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button onClick={handleVerify} disabled={verifying || otp.length !== 6}>
              {verifying ? 'Verifying...' : 'Verify Code'}
            </Button>
            <Button variant="outline" onClick={handleSend} disabled={countdown > 0 || sending}>
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
