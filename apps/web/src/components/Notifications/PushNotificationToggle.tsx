'use client';

import { useEffect, useState } from 'react';
import Button from '../Button';
import {
  isPushSubscribed,
  notificationPermission,
  pushSupported,
  subscribeToPush,
  unsubscribeFromPush,
} from '../../lib/notifications/push';

type PushState = 'unsupported' | 'loading' | 'subscribed' | 'unsubscribed' | 'denied';

export default function PushNotificationToggle() {
  const [state, setState] = useState<PushState>('loading');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!pushSupported()) {
        if (!cancelled) setState('unsupported');
        return;
      }
      const permission = notificationPermission();
      if (permission === 'denied') {
        if (!cancelled) setState('denied');
        return;
      }
      const subscribed = await isPushSubscribed();
      if (!cancelled) setState(subscribed ? 'subscribed' : 'unsubscribed');
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const enable = async () => {
    setBusy(true);
    try {
      const ok = await subscribeToPush();
      setState(ok ? 'subscribed' : notificationPermission() === 'denied' ? 'denied' : 'unsubscribed');
    } finally {
      setBusy(false);
    }
  };

  const disable = async () => {
    setBusy(true);
    try {
      await unsubscribeFromPush();
      setState('unsubscribed');
    } finally {
      setBusy(false);
    }
  };

  if (state === 'unsupported') {
    return null;
  }

  if (state === 'loading') {
    return null;
  }

  if (state === 'denied') {
    return (
      <p style={{ color: 'var(--foreground-muted)', margin: 0, fontSize: '13px' }}>
        Push notifications are blocked in this browser. Enable them in your browser settings.
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontWeight: 700, color: 'var(--foreground)', fontSize: '15px' }}>
          Device notifications
        </div>
        <div style={{ color: 'var(--foreground-muted)', fontSize: '13px', marginTop: '2px' }}>
          {state === 'subscribed'
            ? 'You will get notifications on this device even when DEV-TO-DEV is closed.'
            : 'Get notifications on this device even when DEV-TO-DEV is closed.'}
        </div>
      </div>
      <Button
        variant={state === 'subscribed' ? 'outline' : 'primary'}
        size="sm"
        disabled={busy}
        onClick={state === 'subscribed' ? disable : enable}
      >
        {busy ? 'Working…' : state === 'subscribed' ? 'Disable' : 'Enable'}
      </Button>
    </div>
  );
}
