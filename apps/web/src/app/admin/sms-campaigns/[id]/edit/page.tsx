'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '../../../../../components/admin/AdminUi';
import SmsCampaignForm from '../../../../../components/admin/SmsCampaignForm';

export default function AdminEditSmsCampaignPage() {
  const params = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/admin/sms-campaigns/${params.id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setCampaign(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return <PageHeader title="Edit Campaign" description="Loading..." />;
  }

  if (!campaign) {
    return (
      <div>
        <PageHeader title="Edit Campaign" />
        <div style={{ padding: '24px', border: '1px solid var(--border)', borderRadius: 14, background: 'var(--surface)', color: 'var(--foreground-muted)' }}>
          Campaign not found
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Edit Campaign" description="Update the campaign name or message." />
      <SmsCampaignForm campaignId={campaign.id} initialName={campaign.name} initialMessage={campaign.message} />
    </div>
  );
}
