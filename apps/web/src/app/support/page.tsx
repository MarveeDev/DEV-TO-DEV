import type { Metadata } from 'next';
import { pageMetadata } from '../../lib/seo';
import SupportListClient from './SupportListClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = pageMetadata({
  title: 'Support',
  description:
    'Get help from the DEV-TO-DEV support team. Submit a ticket and track your enquiries.',
  path: '/support',
});

export default function SupportPage() {
  return <SupportListClient />;
}
