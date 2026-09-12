'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import { Pencil, Trash2 } from 'lucide-react';
import { formatPrice } from '../../../lib/currency';

export default function MyListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      const res = await fetch('/api/v1/marketplace/me');
      if (res.ok) {
        setListings(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      const res = await fetch(`/api/v1/marketplace/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setListings(listings.filter(l => l.id !== id));
      } else {
        alert('Failed to delete');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--foreground)' }}>My Listings</h1>
        <Link href="/marketplace/create" style={{ textDecoration: 'none' }}>
          <Button variant="primary">Create Listing</Button>
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--foreground-muted)' }}>Loading...</div>
      ) : listings.length === 0 ? (
        <Card padding="lg">
          <div style={{ textAlign: 'center', color: 'var(--foreground-muted)' }}>
            <p style={{ marginBottom: '16px' }}>You haven't created any marketplace listings yet.</p>
            <Link href="/marketplace/create" style={{ textDecoration: 'none' }}>
              <Button variant="outline">Create your first listing</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {listings.map(listing => (
            <Card key={listing.id} padding="md" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              {listing.imageUrl ? (
                <div style={{ width: '120px', height: '80px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={listing.imageUrl} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <div style={{ width: '120px', height: '80px', borderRadius: 'var(--radius-sm)', background: 'var(--border)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--foreground-muted)' }}>
                  No Image
                </div>
              )}
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 6px', borderRadius: '4px' }}>
                    {listing.type === 'DIGITAL_PRODUCT' ? 'Digital Product' : 'Service'}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>{listing.category}</span>
                </div>
                <Link href={`/marketplace/${listing.id}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '4px' }}>
                    {listing.title}
                  </h3>
                </Link>
                <div style={{ fontWeight: 700, color: 'var(--foreground)' }}>
                  {formatPrice(listing.price, listing.currency)}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <Button variant="outline" size="sm" onClick={() => alert('Edit is not fully implemented in V1 UI but API is ready.')}>
                  <Pencil size={16} />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(listing.id)} style={{ color: '#ef4444', borderColor: '#ef4444' }}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
