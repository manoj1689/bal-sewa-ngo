'use client';

import 'react-responsive-modal/styles.css';

import { useEffect, useMemo, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import { Edit, Loader, Plus, Trash2, Users } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { FormSelect, type FormSelectOption } from '@/components/ui/form-select';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  createVolunteer,
  deleteVolunteer,
  fetchVolunteers,
  updateVolunteer,
} from '@/store/volunteersSlice';
import type { Volunteer } from '@/types';

type VolunteerStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'INACTIVE';

type VolunteerCreateFormState = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  date_of_birth: string;
  skills: string;
  availability: string;
  motivation: string;
  experience: string;
};

type VolunteerEditFormState = {
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  skills: string;
  availability: string;
  status: VolunteerStatus;
};

const volunteerStatusOptions: FormSelectOption<VolunteerStatus>[] = [
  { value: 'PENDING', label: 'PENDING' },
  { value: 'APPROVED', label: 'APPROVED' },
  { value: 'REJECTED', label: 'REJECTED' },
  { value: 'INACTIVE', label: 'INACTIVE' },
];

const createDefaultFormState: VolunteerCreateFormState = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  postal_code: '',
  date_of_birth: '',
  skills: '',
  availability: '',
  motivation: '',
  experience: '',
};

const editDefaultFormState: VolunteerEditFormState = {
  first_name: '',
  last_name: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  postal_code: '',
  skills: '',
  availability: '',
  status: 'PENDING',
};

function getEditFormState(volunteer: Volunteer): VolunteerEditFormState {
  return {
    first_name: volunteer.first_name,
    last_name: volunteer.last_name,
    phone: volunteer.phone,
    address: volunteer.address || '',
    city: volunteer.city || '',
    state: volunteer.state || '',
    postal_code: volunteer.postal_code || '',
    skills: volunteer.skills || '',
    availability: volunteer.availability || '',
    status: (volunteer.status as VolunteerStatus) || 'PENDING',
  };
}

function getVolunteerName(volunteer?: Volunteer | null) {
  if (!volunteer) {
    return 'this volunteer';
  }
  return `${volunteer.first_name} ${volunteer.last_name}`.trim();
}

function formatDate(date?: string) {
  if (!date) {
    return '-';
  }
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  } catch {
    return date;
  }
}

export default function VolunteersPage() {
  const dispatch = useAppDispatch();
  const { items: volunteers, loading, error } = useAppSelector((state) => state.volunteers);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState<Volunteer | null>(null);
  const [deletingVolunteer, setDeletingVolunteer] = useState<Volunteer | null>(null);
  const [createForm, setCreateForm] = useState<VolunteerCreateFormState>(createDefaultFormState);
  const [editForm, setEditForm] = useState<VolunteerEditFormState>(editDefaultFormState);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchVolunteers({}));
  }, [dispatch]);

  const summary = useMemo(() => {
    return {
      approved: volunteers.filter((item) => item.status === 'APPROVED').length,
      pending: volunteers.filter((item) => item.status === 'PENDING').length,
      verified: volunteers.filter((item) => item.is_verified).length,
    };
  }, [volunteers]);

  const openCreateModal = () => {
    setCreateForm(createDefaultFormState);
    setFormError('');
    setIsCreateOpen(true);
  };

  const closeCreateModal = (open: boolean) => {
    setIsCreateOpen(open);
    if (!open) {
      setCreateForm(createDefaultFormState);
      setFormError('');
    }
  };

  const openEditModal = (volunteer: Volunteer) => {
    setEditingVolunteer(volunteer);
    setEditForm(getEditFormState(volunteer));
    setFormError('');
  };

  const closeEditModal = (open: boolean) => {
    if (!open) {
      setEditingVolunteer(null);
      setEditForm(editDefaultFormState);
      setFormError('');
    }
  };

  const closeDeleteModal = (open: boolean) => {
    if (!open) {
      setDeletingVolunteer(null);
    }
  };

  const handleCreateInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!createForm.first_name || !createForm.last_name || !createForm.email || !createForm.phone) {
      setFormError('First name, last name, email, and phone are required');
      return;
    }

    setSubmitting(true);
    const result = await dispatch(
      createVolunteer({
        first_name: createForm.first_name,
        last_name: createForm.last_name,
        email: createForm.email,
        phone: createForm.phone,
        address: createForm.address || undefined,
        city: createForm.city || undefined,
        state: createForm.state || undefined,
        postal_code: createForm.postal_code || undefined,
        date_of_birth: createForm.date_of_birth
          ? new Date(createForm.date_of_birth).toISOString()
          : undefined,
        skills: createForm.skills || undefined,
        availability: createForm.availability || undefined,
        motivation: createForm.motivation || undefined,
        experience: createForm.experience || undefined,
      })
    );
    setSubmitting(false);

    if (createVolunteer.fulfilled.match(result)) {
      closeCreateModal(false);
    } else {
      setFormError((result.payload as string) || 'Failed to create volunteer');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!editingVolunteer) {
      return;
    }

    if (!editForm.first_name || !editForm.last_name || !editForm.phone) {
      setFormError('First name, last name, and phone are required');
      return;
    }

    setSubmitting(true);
    const result = await dispatch(
      updateVolunteer({
        id: editingVolunteer.id,
        data: {
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          phone: editForm.phone,
          address: editForm.address || undefined,
          city: editForm.city || undefined,
          state: editForm.state || undefined,
          postal_code: editForm.postal_code || undefined,
          skills: editForm.skills || undefined,
          availability: editForm.availability || undefined,
          status: editForm.status,
        },
      })
    );
    setSubmitting(false);

    if (updateVolunteer.fulfilled.match(result)) {
      closeEditModal(false);
    } else {
      setFormError((result.payload as string) || 'Failed to update volunteer');
    }
  };

  const handleDelete = async () => {
    if (!deletingVolunteer) {
      return;
    }

    setDeleteSubmitting(true);
    const result = await dispatch(deleteVolunteer(deletingVolunteer.id));
    setDeleteSubmitting(false);

    if (deleteVolunteer.fulfilled.match(result)) {
      closeDeleteModal(false);
    }
  };

  if (loading && volunteers.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Volunteers Management</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage volunteer registrations, track approval status, and keep contact information updated.
          </p>
        </div>

        <Button
          type="button"
          onClick={openCreateModal}
          className="h-10 rounded-xl bg-primary px-4 text-primary-foreground hover:bg-secondary"
        >
          <Plus size={18} />
          Add Volunteer
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Approved volunteers</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{summary.approved}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Pending review</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{summary.pending}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Verified volunteers</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{summary.verified}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[1040px]">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Volunteer</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Contact</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Skills</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Availability</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {volunteers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  No volunteers found
                </td>
              </tr>
            ) : (
              volunteers.map((volunteer) => (
                <tr key={volunteer.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 text-sm text-foreground">
                    <div className="font-semibold">{getVolunteerName(volunteer)}</div>
                    <div className="text-xs text-muted-foreground">{volunteer.city || '-'} {volunteer.state ? `, ${volunteer.state}` : ''}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    <div>{volunteer.email}</div>
                    <div className="text-xs text-muted-foreground">{volunteer.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{volunteer.skills || '-'}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{volunteer.availability || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-col gap-2">
                      <span
                        className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${
                          volunteer.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : volunteer.status === 'REJECTED'
                              ? 'bg-red-100 text-red-800'
                              : volunteer.status === 'INACTIVE'
                                ? 'bg-slate-100 text-slate-800'
                                : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {volunteer.status}
                      </span>
                      {volunteer.is_verified && (
                        <span className="inline-flex w-fit rounded-full bg-secondary/15 px-3 py-1 text-xs font-medium text-secondary">
                          Verified
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(volunteer)}
                        className="rounded-lg border-border bg-muted text-foreground hover:bg-accent/20"
                      >
                        <Edit size={16} />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingVolunteer(volunteer)}
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
        classNames={{ modal: 'w-full max-w-4xl rounded-3xl bg-card p-0 text-foreground overflow-visible' }}
      >
        <div className="border-b border-border bg-card px-6 py-5 sm:px-8">
          <h2 className="text-2xl font-bold text-foreground">Create Volunteer</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Add a volunteer registration record with contact details, skills, and motivation.
          </p>
        </div>
        <VolunteerCreateForm
          formData={createForm}
          formError={formError}
          loading={submitting}
          onInputChange={handleCreateInputChange}
          onSubmit={handleCreate}
          onCancel={() => closeCreateModal(false)}
        />
      </Modal>

      <Modal
        open={!!editingVolunteer}
        onClose={() => closeEditModal(false)}
        center
        classNames={{ modal: 'w-full max-w-4xl rounded-3xl bg-card p-0 text-foreground overflow-visible' }}
      >
        <div className="border-b border-border bg-card px-6 py-5 sm:px-8">
          <h2 className="text-2xl font-bold text-foreground">Edit Volunteer</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Update volunteer contact details, availability, and approval status.
          </p>
        </div>
        <VolunteerEditForm
          formData={editForm}
          formError={formError}
          loading={submitting}
          onInputChange={handleEditInputChange}
          onStatusChange={(value) => setEditForm((prev) => ({ ...prev, status: value }))}
          onSubmit={handleEdit}
          onCancel={() => closeEditModal(false)}
        />
      </Modal>

      <Modal
        open={!!deletingVolunteer}
        onClose={() => closeDeleteModal(false)}
        center
        classNames={{ modal: 'w-full max-w-md rounded-3xl bg-card p-0 text-foreground overflow-hidden' }}
      >
        <div className="border-b border-border bg-card px-6 py-5">
          <h2 className="text-2xl font-bold text-foreground">Delete Volunteer</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This will permanently remove the volunteer registration.
          </p>
        </div>
        <div className="bg-card px-6 py-6 text-sm text-muted-foreground">
          Delete <span className="font-semibold text-foreground">{getVolunteerName(deletingVolunteer)}</span>?
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

type VolunteerCreateFormProps = {
  formData: VolunteerCreateFormState;
  formError: string;
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

function VolunteerCreateForm({
  formData,
  formError,
  loading,
  onInputChange,
  onSubmit,
  onCancel,
}: VolunteerCreateFormProps) {
  return (
    <form onSubmit={onSubmit} className="bg-card text-foreground">
      <div className="space-y-6 bg-card px-6 py-6 sm:px-8">
        {formError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {formError}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="First Name *" htmlFor="create-first-name">
            <Input id="create-first-name" name="first_name" value={formData.first_name} onChange={onInputChange} disabled={loading} className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30" />
          </Field>
          <Field label="Last Name *" htmlFor="create-last-name">
            <Input id="create-last-name" name="last_name" value={formData.last_name} onChange={onInputChange} disabled={loading} className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30" />
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Email *" htmlFor="create-email">
            <Input id="create-email" type="email" name="email" value={formData.email} onChange={onInputChange} disabled={loading} className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30" />
          </Field>
          <Field label="Phone *" htmlFor="create-phone">
            <Input id="create-phone" name="phone" value={formData.phone} onChange={onInputChange} disabled={loading} className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30" />
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Address" htmlFor="create-address">
            <Input id="create-address" name="address" value={formData.address} onChange={onInputChange} disabled={loading} className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30" />
          </Field>
          <Field label="City" htmlFor="create-city">
            <Input id="create-city" name="city" value={formData.city} onChange={onInputChange} disabled={loading} className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30" />
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <Field label="State" htmlFor="create-state">
            <Input id="create-state" name="state" value={formData.state} onChange={onInputChange} disabled={loading} className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30" />
          </Field>
          <Field label="Postal Code" htmlFor="create-postal-code">
            <Input id="create-postal-code" name="postal_code" value={formData.postal_code} onChange={onInputChange} disabled={loading} className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30" />
          </Field>
          <Field label="Date of Birth" htmlFor="create-date-of-birth">
            <Input id="create-date-of-birth" type="date" name="date_of_birth" value={formData.date_of_birth} onChange={onInputChange} disabled={loading} className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30" />
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Skills" htmlFor="create-skills">
            <Input id="create-skills" name="skills" value={formData.skills} onChange={onInputChange} placeholder="Teaching, outreach, logistics" disabled={loading} className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30" />
          </Field>
          <Field label="Availability" htmlFor="create-availability">
            <Input id="create-availability" name="availability" value={formData.availability} onChange={onInputChange} placeholder="Weekends, evenings" disabled={loading} className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30" />
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <TextareaField label="Motivation" htmlFor="create-motivation" name="motivation" value={formData.motivation} onChange={onInputChange} disabled={loading} placeholder="Why the volunteer wants to join" />
          <TextareaField label="Experience" htmlFor="create-experience" name="experience" value={formData.experience} onChange={onInputChange} disabled={loading} placeholder="Relevant experience or background" />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border bg-card p-4 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground hover:bg-secondary">
          {loading ? 'Creating...' : 'Create Volunteer'}
        </Button>
      </div>
    </form>
  );
}

type VolunteerEditFormProps = {
  formData: VolunteerEditFormState;
  formError: string;
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onStatusChange: (value: VolunteerStatus) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

function VolunteerEditForm({
  formData,
  formError,
  loading,
  onInputChange,
  onStatusChange,
  onSubmit,
  onCancel,
}: VolunteerEditFormProps) {
  return (
    <form onSubmit={onSubmit} className="bg-card text-foreground">
      <div className="space-y-6 bg-card px-6 py-6 sm:px-8">
        {formError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {formError}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="First Name *" htmlFor="edit-first-name">
            <Input id="edit-first-name" name="first_name" value={formData.first_name} onChange={onInputChange} disabled={loading} className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30" />
          </Field>
          <Field label="Last Name *" htmlFor="edit-last-name">
            <Input id="edit-last-name" name="last_name" value={formData.last_name} onChange={onInputChange} disabled={loading} className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30" />
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Phone *" htmlFor="edit-phone">
            <Input id="edit-phone" name="phone" value={formData.phone} onChange={onInputChange} disabled={loading} className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30" />
          </Field>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Status</label>
            <FormSelect<VolunteerStatus>
              inputId="edit-volunteer-status"
              options={volunteerStatusOptions}
              value={formData.status}
              onChange={onStatusChange}
              disabled={loading}
              placeholder="Select status"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Address" htmlFor="edit-address">
            <Input id="edit-address" name="address" value={formData.address} onChange={onInputChange} disabled={loading} className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30" />
          </Field>
          <Field label="City" htmlFor="edit-city">
            <Input id="edit-city" name="city" value={formData.city} onChange={onInputChange} disabled={loading} className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30" />
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="State" htmlFor="edit-state">
            <Input id="edit-state" name="state" value={formData.state} onChange={onInputChange} disabled={loading} className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30" />
          </Field>
          <Field label="Postal Code" htmlFor="edit-postal-code">
            <Input id="edit-postal-code" name="postal_code" value={formData.postal_code} onChange={onInputChange} disabled={loading} className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30" />
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Skills" htmlFor="edit-skills">
            <Input id="edit-skills" name="skills" value={formData.skills} onChange={onInputChange} disabled={loading} className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30" />
          </Field>
          <Field label="Availability" htmlFor="edit-availability">
            <Input id="edit-availability" name="availability" value={formData.availability} onChange={onInputChange} disabled={loading} className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30" />
          </Field>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border bg-card p-4 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground hover:bg-secondary">
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function TextareaField({
  label,
  htmlFor,
  name,
  value,
  onChange,
  disabled,
  placeholder,
}: {
  label: string;
  htmlFor: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  disabled: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-foreground">
        {label}
      </label>
      <textarea
        id={htmlFor}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={4}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-slate-700 shadow-none outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 dark:text-slate-200"
      />
    </div>
  );
}
