'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/hooks';
import { createUser } from '@/store/usersSlice';
import { ArrowLeft } from '@/components/icons';
import Link from 'next/link';

export default function CreateUserPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'VOLUNTEER_MANAGER',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.password || !formData.name) {
      setError('Email, password, and name are required');
      setLoading(false);
      return;
    }

    const result = await dispatch(
      createUser({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone || undefined,
        role: formData.role as 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'VOLUNTEER_MANAGER',
      })
    );

    setLoading(false);

    if (createUser.fulfilled.match(result)) {
      router.push('/dashboard/users');
    } else {
      setError((result.payload as string) || 'Failed to create user');
    }
  };

  return (
    <div>
      <Link
        href="/dashboard/users"
        className="flex items-center gap-2 text-primary hover:underline mb-8"
      >
        <ArrowLeft size={20} />
        Back to Users
      </Link>

      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New User</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email *
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
              disabled={loading}
              className="w-full px-4 py-2 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password *
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading}
              className="w-full px-4 py-2 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Name *
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              disabled={loading}
              className="w-full px-4 py-2 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
              Phone
            </label>
            <input
              id="phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              disabled={loading}
              className="w-full px-4 py-2 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-border bg-card rounded-lg focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
            >
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              <option value="ADMIN">ADMIN</option>
              <option value="EDITOR">EDITOR</option>
              <option value="VOLUNTEER_MANAGER">VOLUNTEER_MANAGER</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
            <Link
              href="/dashboard/users"
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
