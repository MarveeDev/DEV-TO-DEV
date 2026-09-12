'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import { ArrowLeft, ExternalLink, Mail } from 'lucide-react';

export default function ListingDetailsClient({
  id,
  initialListing,
}: {
  id: string;
  initialListing: any | null;
}) {
  const router = useRouter();
  const [listing, setListing] = useState<any>(initialListing);
  const [loading, setLoading] = useState(initialListing === null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/v1/marketplace/${id}`);
        if (res.ok) {
          setListing(await res.json());
        } else if (!listing) {
          router.push('/marketplace');
        }
      } catch (err) {
        console.error(err);
        if (!listing) router.push('/marketplace');
      } finally {
        setLoading(false);
      }
    };
    if (initialListing === null && id) {
      fetchListing();
    } else {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => setCurrentUser(data))
      .catch(() => {});
  }, []);

  const isSeller = currentUser?.developerProfile?.id === listing?.seller?.id;

  const handleMessageSeller = async () => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    try {
      const res = await fetch(`/api/v1/messages/marketplace/${listing.id}`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        const partnerUsername = data.partner?.profile?.username;
        router.push(`/messages/${encodeURIComponent(partnerUsername)}?conversation=${data.id}&listing=${listing.id}`);
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.message || 'Unable to contact this seller. Please try again.');
      }
    } catch {
      alert('Unable to contact this seller. Please try again.');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px' }}>Loading...</div>;
  }

  if (!listing) return null;

  return (
    <div style={{ padding: '40px 24px', maxWidth: '900px', margin: '0 auto' }}>
      <button
        onClick={() => router.back()}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--foreground-muted)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '24px', fontSize: '14px', fontWeight: 600 }}
      >
        <ArrowLeft size={16} />
        Back to Marketplace
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>

        {/* Main Content */}
        <div>
          {listing.imageUrl && (
            <div style={{ width: '100%', height: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '24px' }}>
              <img src={listing.imageUrl} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)', background: 'var(--primary-light)', padding: '4px 10px', borderRadius: 'var(--radius-sm)' }}>
              {listing.type === 'DIGITAL_PRODUCT' ? 'Digital Product' : 'Service'}
            </span>
            <span style={{ color: 'var(--foreground-muted)', fontSize: '14px' }}>
              {listing.category}
            </span>
          </div>

          <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--foreground)', marginBottom: '16px' }}>
            {listing.title}
          </h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
            {listing.tags && listing.tags.map((tag: string) => (
              <span key={tag} style={{ background: 'var(--border)', color: 'var(--foreground)', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 500 }}>
                {tag}
              </span>
            ))}
          </div>

          <div style={{ fontSize: '16px', color: 'var(--foreground)', lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: '32px' }}>
            {listing.description}
          </div>
        </div>

        {/* Sidebar / Actions */}
        <div style={{ position: 'sticky', top: '80px', alignSelf: 'start' }}>
          <Card padding="lg" style={{ border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--foreground)', marginBottom: '24px' }}>
              ${listing.price.toFixed(2)}
            </div>

            {listing.externalUrl && (
              <a href={listing.externalUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', marginBottom: '16px' }}>
                <Button variant="primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  <ExternalLink size={18} />
                  View Product / Demo
                </Button>
              </a>
            )}

            {isSeller ? (
              <Button variant="secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} disabled>
                Your Listing
              </Button>
            ) : (
              <Button variant="primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} onClick={handleMessageSeller}>
                <Mail size={18} />
                Message Seller
              </Button>
            )}

            <div style={{ marginTop: '32px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground-muted)', marginBottom: '16px' }}>
                Listed by
              </div>
              <Link href={`/developers/${listing.seller.username}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                {listing.seller.avatarUrl ? (
                  <img src={listing.seller.avatarUrl} alt={listing.seller.displayName} style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                ) : (
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--border)' }} />
                )}
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--foreground)', fontSize: '16px' }}>
                    {listing.seller.displayName}
                  </div>
                  <div style={{ color: 'var(--foreground-muted)', fontSize: '14px' }}>
                    @{listing.seller.username}
                  </div>
                </div>
              </Link>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
