'use client';

import { Megaphone } from '@/components/icons';

export default function CampaignsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Campaigns Management</h1>

      <div className="bg-white rounded-lg shadow p-12">
        <div className="text-center">
          <Megaphone size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">Campaigns management coming soon</p>
          <p className="text-gray-500 mt-2">
            This section will allow you to create and manage fundraising campaigns
          </p>
        </div>
      </div>
    </div>
  );
}
