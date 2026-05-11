'use client';

import { MessageSquare } from '@/components/icons';

export default function TestimonialsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Testimonials Management</h1>

      <div className="bg-white rounded-lg shadow p-12">
        <div className="text-center">
          <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">Testimonials management coming soon</p>
          <p className="text-gray-500 mt-2">
            This section will allow you to manage and moderate testimonials
          </p>
        </div>
      </div>
    </div>
  );
}
