'use client';

import React from 'react';
import Link from 'next/link';
import BackButton from '../components/Navigation/BackButton';
import Card from '../components/Card';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '60px' }}>
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center' }}>
        <BackButton fallback="/" />
        <span style={{ marginLeft: '16px', fontSize: '18px', fontWeight: 600, color: 'var(--foreground)' }}>
          Page Not Found
        </span>
      </div>

      <Card padding="lg" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 800, margin: '0 0 16px 0', color: 'var(--foreground)' }}>404</h1>
        <p style={{ fontSize: '18px', color: 'var(--foreground-muted)', margin: '0 0 32px 0' }}>
          This page could not be found. The course material or resource you are looking for may have been moved or deleted.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Button variant="primary">Go to Home</Button>
          </Link>
          <Link href="/roadmaps" style={{ textDecoration: 'none' }}>
            <Button variant="outline">Browse Roadmaps</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
