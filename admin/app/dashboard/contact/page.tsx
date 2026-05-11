'use client';

import { Mail } from '@/components/icons';

export default function ContactPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Contact Messages</h1>

      <div className="bg-white rounded-lg shadow p-12">
        <div className="text-center">
          <Mail size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">Contact messages coming soon</p>
          <p className="text-gray-500 mt-2">
            This section will allow you to view and manage contact form submissions
          </p>
        </div>
      </div>
    </div>
  );
}
