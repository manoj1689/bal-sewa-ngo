'use client';

import { Calendar } from '@/components/icons';

export default function EventsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Events Management</h1>

      <div className="bg-white rounded-lg shadow p-12">
        <div className="text-center">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">Events management coming soon</p>
          <p className="text-gray-500 mt-2">
            This section will allow you to create and manage organization events
          </p>
        </div>
      </div>
    </div>
  );
}
