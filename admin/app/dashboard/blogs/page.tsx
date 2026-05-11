'use client';

import { FileText } from '@/components/icons';

export default function BlogsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Blogs Management</h1>

      <div className="bg-white rounded-lg shadow p-12">
        <div className="text-center">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">Blogs management coming soon</p>
          <p className="text-gray-500 mt-2">
            This section will allow you to create, edit, and manage blog posts
          </p>
        </div>
      </div>
    </div>
  );
}
