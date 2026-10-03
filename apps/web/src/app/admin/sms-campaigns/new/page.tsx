'use client';

import { PageHeader } from '../../../../components/admin/AdminUi';
import SmsCampaignForm from '../../../../components/admin/SmsCampaignForm';

export default function AdminNewSmsCampaignPage() {
  return (
    <div>
      <PageHeader title="Create Campaign" description="Draft a new SMS campaign. Sending will be added in a later phase." />
      <SmsCampaignForm />
    </div>
  );
}
