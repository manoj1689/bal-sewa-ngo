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
import { FormSelect, type FormSelectOption } from '@/components/ui/form-select';
import { Input } from '@/components/ui/input';

type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'VOLUNTEER_MANAGER';

const userRoleOptions: FormSelectOption<UserRole>[] = [
  { value: 'SUPER_ADMIN', label: 'SUPER_ADMIN' },
  { value: 'ADMIN', label: 'ADMIN' },
  { value: 'EDITOR', label: 'EDITOR' },
  { value: 'VOLUNTEER_MANAGER', label: 'VOLUNTEER_MANAGER' },
];

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
        <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
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
        <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-muted-foreground">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 text-sm text-foreground">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{user.name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{user.role || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        user.is_active
                          ? 'bg-secondary/15 text-secondary'
                          : 'bg-destructive/10 text-destructive'
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
                        className="rounded-lg border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/15"
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
        classNames={{ modal: 'w-full max-w-2xl rounded-3xl bg-card p-0 text-foreground overflow-hidden' }}
      >
        <div className="border-b border-border bg-card px-6 py-5 sm:px-8">
          <h2 className="text-2xl font-bold text-foreground">Create User</h2>
          <p className="mt-2 text-sm text-muted-foreground">
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
        classNames={{ modal: 'w-full max-w-2xl rounded-3xl bg-card p-0 text-foreground overflow-hidden' }}
      >
        <div className="border-b border-border bg-card px-6 py-5 sm:px-8">
          <h2 className="text-2xl font-bold text-foreground">Edit User</h2>
          <p className="mt-2 text-sm text-muted-foreground">
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
        classNames={{ modal: 'w-full max-w-md rounded-3xl bg-card p-0 text-foreground overflow-hidden' }}
      >
        <div className="border-b border-border bg-card px-6 py-5">
          <h2 className="text-2xl font-bold text-foreground">Delete User</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This will permanently remove the user from the admin system.
          </p>
        </div>
        <div className="bg-card px-6 py-6 text-sm text-muted-foreground">
          Delete <span className="font-semibold text-foreground">{deletingUser?.email}</span>?
          This action cannot be undone.
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-border bg-card p-4 sm:flex-row sm:justify-end">
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
    <form onSubmit={onSubmit} className="bg-card text-foreground">
      <div className="space-y-6 bg-card px-6 py-6 sm:px-8">
        {formError && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {formError}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor={`${isEdit ? 'edit' : 'create'}-email`} className="text-sm font-semibold text-foreground">
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
            <label htmlFor="create-password" className="text-sm font-semibold text-foreground">
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
            <label htmlFor={`${isEdit ? 'edit' : 'create'}-name`} className="text-sm font-semibold text-foreground">
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
            <label htmlFor={`${isEdit ? 'edit' : 'create'}-phone`} className="text-sm font-semibold text-foreground">
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
          <label className="text-sm font-semibold text-foreground">Role</label>
          <FormSelect<UserRole>
            inputId={`${isEdit ? 'edit' : 'create'}-role`}
            options={userRoleOptions}
            value={formData.role}
            onChange={onRoleChange}
            disabled={loading}
            placeholder="Select role"
          />
        </div>

        {isEdit && (
          <label className="flex items-start gap-3 rounded-2xl border border-border bg-muted/40 p-4">
            <Checkbox
              checked={formData.is_active}
              onCheckedChange={onActiveChange}
              className="mt-0.5"
            />
            <div>
              <p className="text-sm font-semibold text-foreground">Active account</p>
              <p className="text-xs text-muted-foreground">Inactive users will not be able to log in.</p>
            </div>
          </label>
        )}
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border bg-card p-4 sm:flex-row sm:justify-end">
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
