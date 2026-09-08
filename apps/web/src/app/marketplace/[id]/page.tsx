'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import { ArrowLeft, ExternalLink, Mail } from 'lucide-react';

export default function ListingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/v1/marketplace/${params.id}`);
        if (res.ok) {
          setListing(await res.json());
        } else {
          router.push('/marketplace');
        }
      } catch (err) {
        console.error(err);
        router.push('/marketplace');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchListing();
    }
  }, [params.id, router]);

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

            <Button variant="outline" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} onClick={() => alert('Secure messaging will be implemented in future versions.')}>
              <Mail size={18} />
              Contact Seller
            </Button>

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
