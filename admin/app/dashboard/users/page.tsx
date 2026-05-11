'use client';

import 'react-responsive-modal/styles.css';

import { useEffect, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import { Edit, Loader, Plus, Trash2 } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { createUser, deleteUser, fetchUsers, updateUser } from '@/store/usersSlice';
import type { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'VOLUNTEER_MANAGER';

type UserFormState = {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: UserRole;
  is_active: boolean;
};

const defaultFormState: UserFormState = {
  email: '',
  password: '',
  name: '',
  phone: '',
  role: 'VOLUNTEER_MANAGER',
  is_active: true,
};

function getEditFormState(user: User): UserFormState {
  return {
    email: user.email,
    password: '',
    name: user.name || '',
    phone: user.phone || '',
    role: (user.role as UserRole) || 'VOLUNTEER_MANAGER',
    is_active: user.is_active,
  };
}

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { items: users, loading, error } = useAppSelector((state) => state.users);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormState>(defaultFormState);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers({}));
  }, [dispatch]);

  const openCreateModal = () => {
    setFormData(defaultFormState);
    setFormError('');
    setIsCreateOpen(true);
  };

  const closeCreateModal = (open: boolean) => {
    setIsCreateOpen(open);
    if (!open) {
      setFormError('');
      setFormData(defaultFormState);
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData(getEditFormState(user));
    setFormError('');
  };

  const closeEditModal = (open: boolean) => {
    if (!open) {
      setEditingUser(null);
      setFormError('');
      setFormData(defaultFormState);
    }
  };

  const closeDeleteModal = (open: boolean) => {
    if (!open) {
      setDeletingUser(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.email || !formData.password || !formData.name) {
      setFormError('Email, password, and name are required');
      return;
    }

    setSubmitting(true);

    const result = await dispatch(
      createUser({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone || undefined,
        role: formData.role,
      })
    );

    setSubmitting(false);

    if (createUser.fulfilled.match(result)) {
      closeCreateModal(false);
    } else {
      setFormError((result.payload as string) || 'Failed to create user');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!editingUser) {
      return;
    }

    if (!formData.email || !formData.name) {
      setFormError('Email and name are required');
      return;
    }

    setSubmitting(true);

    const result = await dispatch(
      updateUser({
        id: editingUser.id,
        data: {
          email: formData.email,
          name: formData.name,
          phone: formData.phone || undefined,
          role: formData.role,
          is_active: formData.is_active,
        },
      })
    );

    setSubmitting(false);

    if (updateUser.fulfilled.match(result)) {
      closeEditModal(false);
    } else {
      setFormError((result.payload as string) || 'Failed to update user');
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) {
      return;
    }

    setDeleteSubmitting(true);
    const result = await dispatch(deleteUser(deletingUser.id));
    setDeleteSubmitting(false);

    if (deleteUser.fulfilled.match(result)) {
      closeDeleteModal(false);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Users Management</h1>
        <Button
          type="button"
          onClick={openCreateModal}
          className="h-10 rounded-xl bg-primary px-4 text-primary-foreground hover:bg-secondary"
        >
          <Plus size={18} />
          Add User
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
        <table className="w-full">
          <thead className="border-b bg-slate-50/80">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4 text-sm text-gray-800">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{user.name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{user.role || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        user.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(user)}
                        className="rounded-lg border-border bg-muted text-foreground hover:bg-accent/20"
                      >
                        <Edit size={16} />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingUser(user)}
                        className="rounded-lg border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={isCreateOpen}
        onClose={() => closeCreateModal(false)}
        center
        classNames={{ modal: 'w-full max-w-2xl rounded-3xl p-0 overflow-hidden' }}
      >
        <div className="border-b px-6 py-5 sm:px-8">
          <h2 className="text-2xl font-bold text-slate-900">Create User</h2>
          <p className="mt-2 text-sm text-slate-500">
            Add a new user to the NGO admin system with the correct access role.
          </p>
        </div>
        <UserForm
          formData={formData}
          formError={formError}
          loading={submitting}
          isEdit={false}
          onInputChange={handleInputChange}
          onRoleChange={(role) => setFormData((prev) => ({ ...prev, role: role as UserRole }))}
          onActiveChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
          onSubmit={handleCreate}
          onCancel={() => closeCreateModal(false)}
        />
      </Modal>

      <Modal
        open={!!editingUser}
        onClose={() => closeEditModal(false)}
        center
        classNames={{ modal: 'w-full max-w-2xl rounded-3xl p-0 overflow-hidden' }}
      >
        <div className="border-b px-6 py-5 sm:px-8">
          <h2 className="text-2xl font-bold text-slate-900">Edit User</h2>
          <p className="mt-2 text-sm text-slate-500">
            Update profile details, access level, and account status.
          </p>
        </div>
        <UserForm
          formData={formData}
          formError={formError}
          loading={submitting}
          isEdit
          onInputChange={handleInputChange}
          onRoleChange={(role) => setFormData((prev) => ({ ...prev, role: role as UserRole }))}
          onActiveChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
          onSubmit={handleEdit}
          onCancel={() => closeEditModal(false)}
        />
      </Modal>

      <Modal
        open={!!deletingUser}
        onClose={() => closeDeleteModal(false)}
        center
        classNames={{ modal: 'w-full max-w-md rounded-3xl p-0 overflow-hidden' }}
      >
        <div className="border-b px-6 py-5">
          <h2 className="text-2xl font-bold text-slate-900">Delete User</h2>
          <p className="mt-2 text-sm text-slate-500">
            This will permanently remove the user from the admin system.
          </p>
        </div>
        <div className="px-6 py-6 text-sm text-slate-600">
          Delete <span className="font-semibold text-slate-900">{deletingUser?.email}</span>?
          This action cannot be undone.
        </div>
        <div className="flex flex-col-reverse gap-2 border-t bg-white p-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => closeDeleteModal(false)}
            disabled={deleteSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteSubmitting}
          >
            {deleteSubmitting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

type UserFormProps = {
  formData: UserFormState;
  formError: string;
  loading: boolean;
  isEdit: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRoleChange: (value: UserRole | null) => void;
  onActiveChange: (checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

function UserForm({
  formData,
  formError,
  loading,
  isEdit,
  onInputChange,
  onRoleChange,
  onActiveChange,
  onSubmit,
  onCancel,
}: UserFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-6 px-6 py-6 sm:px-8">
        {formError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {formError}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor={`${isEdit ? 'edit' : 'create'}-email`} className="text-sm font-semibold text-slate-700">
            Email *
          </label>
          <Input
            id={`${isEdit ? 'edit' : 'create'}-email`}
            type="email"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            placeholder="user@example.com"
            disabled={loading}
            className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
          />
        </div>

        {!isEdit && (
          <div className="space-y-2">
            <label htmlFor="create-password" className="text-sm font-semibold text-slate-700">
              Password *
            </label>
            <Input
              id="create-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={onInputChange}
              placeholder="••••••••"
              disabled={loading}
              className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
            />
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor={`${isEdit ? 'edit' : 'create'}-name`} className="text-sm font-semibold text-slate-700">
              Name *
            </label>
            <Input
              id={`${isEdit ? 'edit' : 'create'}-name`}
              type="text"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              placeholder="John Doe"
              disabled={loading}
              className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor={`${isEdit ? 'edit' : 'create'}-phone`} className="text-sm font-semibold text-slate-700">
              Phone
            </label>
            <Input
              id={`${isEdit ? 'edit' : 'create'}-phone`}
              type="text"
              name="phone"
              value={formData.phone}
              onChange={onInputChange}
              placeholder="+91 9876543210"
              disabled={loading}
              className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Role</label>
          <Select value={formData.role} onValueChange={onRoleChange}>
            <SelectTrigger className="h-11 w-full rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SUPER_ADMIN">SUPER_ADMIN</SelectItem>
              <SelectItem value="ADMIN">ADMIN</SelectItem>
              <SelectItem value="EDITOR">EDITOR</SelectItem>
              <SelectItem value="VOLUNTEER_MANAGER">VOLUNTEER_MANAGER</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isEdit && (
          <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <Checkbox
              checked={formData.is_active}
              onCheckedChange={onActiveChange}
              className="mt-0.5"
            />
            <div>
              <p className="text-sm font-semibold text-slate-800">Active account</p>
              <p className="text-xs text-slate-500">Inactive users will not be able to log in.</p>
            </div>
          </label>
        )}
      </div>

      <div className="flex flex-col-reverse gap-2 border-t bg-white p-4 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground hover:bg-secondary">
          {loading ? (isEdit ? 'Saving...' : 'Creating...') : isEdit ? 'Save Changes' : 'Create User'}
        </Button>
      </div>
    </form>
  );
}
