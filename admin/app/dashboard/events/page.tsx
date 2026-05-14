'use client';

import 'react-responsive-modal/styles.css';

import { useEffect, useMemo, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import { Calendar, Edit, Loader, Plus, Trash2 } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { FormSelect, type FormSelectOption } from '@/components/ui/form-select';
import { Input } from '@/components/ui/input';
import { MultiImageUploadField } from '@/components/ui/multi-image-upload-field';
import { UploadField } from '@/components/ui/upload-field';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { createEvent, deleteEvent, fetchEvents, updateEvent } from '@/store/eventsSlice';
import type { Event } from '@/types';

type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

type EventFormState = {
  title: string;
  description: string;
  event_date: string;
  end_date: string;
  location: string;
  image_url: string;
  extra_images: string[];
  status: EventStatus;
  max_attendees: string;
  seo_title: string;
  seo_description: string;
};

const eventStatusOptions: FormSelectOption<EventStatus>[] = [
  { value: 'UPCOMING', label: 'UPCOMING' },
  { value: 'ONGOING', label: 'ONGOING' },
  { value: 'COMPLETED', label: 'COMPLETED' },
  { value: 'CANCELLED', label: 'CANCELLED' },
];

const defaultFormState: EventFormState = {
  title: '',
  description: '',
  event_date: '',
  end_date: '',
  location: '',
  image_url: '',
  extra_images: [],
  status: 'UPCOMING',
  max_attendees: '',
  seo_title: '',
  seo_description: '',
};

function getEditFormState(event: Event): EventFormState {
  return {
    title: event.title,
    description: event.description,
    event_date: event.event_date ? event.event_date.slice(0, 16) : '',
    end_date: event.end_date ? event.end_date.slice(0, 16) : '',
    location: event.location,
    image_url: event.image_url || '',
    extra_images: event.extra_images || [],
    status: (event.status as EventStatus) || 'UPCOMING',
    max_attendees: event.max_attendees ? String(event.max_attendees) : '',
    seo_title: event.seo_title || '',
    seo_description: event.seo_description || '',
  };
}

function formatDateTime(date?: string) {
  if (!date) {
    return '-';
  }

  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  } catch {
    return date;
  }
}

function getStatusTone(status: EventStatus) {
  switch (status) {
    case 'UPCOMING':
      return 'bg-accent text-accent-foreground';
    case 'ONGOING':
      return 'bg-secondary text-secondary-foreground';
    case 'COMPLETED':
      return 'bg-muted text-foreground';
    case 'CANCELLED':
      return 'bg-destructive/10 text-destructive';
    default:
      return 'bg-muted text-foreground';
  }
}

export default function EventsPage() {
  const dispatch = useAppDispatch();
  const { items: events, loading, error } = useAppSelector((state) => state.events);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<EventFormState>(defaultFormState);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchEvents({}));
  }, [dispatch]);

  const summary = useMemo(
    () => ({
      total: events.length,
      upcoming: events.filter((item) => item.status === 'UPCOMING').length,
      attendees: events.reduce((sum, item) => sum + (item.attendees_count || 0), 0),
    }),
    [events]
  );

  const openCreateModal = () => {
    setFormData(defaultFormState);
    setFormError('');
    setIsCreateOpen(true);
  };

  const closeCreateModal = (open: boolean) => {
    setIsCreateOpen(open);
    if (!open) {
      setFormData(defaultFormState);
      setFormError('');
    }
  };

  const openEditModal = (event: Event) => {
    setEditingEvent(event);
    setFormData(getEditFormState(event));
    setFormError('');
  };

  const closeEditModal = (open: boolean) => {
    if (!open) {
      setEditingEvent(null);
      setFormData(defaultFormState);
      setFormError('');
    }
  };

  const closeDeleteModal = (open: boolean) => {
    if (!open) {
      setDeletingEvent(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buildPayload = () => {
    const maxAttendees = formData.max_attendees ? Number(formData.max_attendees) : undefined;

    return {
      title: formData.title,
      description: formData.description,
      event_date: new Date(formData.event_date).toISOString(),
      end_date: formData.end_date ? new Date(formData.end_date).toISOString() : undefined,
      location: formData.location,
      image_url: formData.image_url || undefined,
      extra_images: formData.extra_images,
      status: formData.status,
      max_attendees: maxAttendees,
      seo_title: formData.seo_title || undefined,
      seo_description: formData.seo_description || undefined,
    };
  };

  const validateForm = () => {
    if (!formData.title || !formData.description || !formData.event_date || !formData.location) {
      return 'Title, description, event date, and location are required';
    }

    if (formData.max_attendees) {
      const maxAttendees = Number(formData.max_attendees);
      if (Number.isNaN(maxAttendees) || maxAttendees <= 0) {
        return 'Max attendees must be greater than zero';
      }
    }

    if (formData.end_date && new Date(formData.end_date) < new Date(formData.event_date)) {
      return 'End date cannot be earlier than event date';
    }

    return '';
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    setFormError(validationError);

    if (validationError) {
      return;
    }

    setSubmitting(true);
    const result = await dispatch(createEvent(buildPayload()));
    setSubmitting(false);

    if (createEvent.fulfilled.match(result)) {
      closeCreateModal(false);
    } else {
      setFormError((result.payload as string) || 'Failed to create event');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingEvent) {
      return;
    }

    const validationError = validateForm();
    setFormError(validationError);

    if (validationError) {
      return;
    }

    setSubmitting(true);
    const result = await dispatch(
      updateEvent({
        id: editingEvent.id,
        data: buildPayload(),
      })
    );
    setSubmitting(false);

    if (updateEvent.fulfilled.match(result)) {
      closeEditModal(false);
    } else {
      setFormError((result.payload as string) || 'Failed to update event');
    }
  };

  const handleDelete = async () => {
    if (!deletingEvent) {
      return;
    }

    setDeleteSubmitting(true);
    const result = await dispatch(deleteEvent(deletingEvent.id));
    setDeleteSubmitting(false);

    if (deleteEvent.fulfilled.match(result)) {
      closeDeleteModal(false);
    }
  };

  if (loading && events.length === 0) {
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
          <h1 className="text-3xl font-bold text-foreground">Events Management</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Plan, schedule, and track organization events with timeline and attendee details.
          </p>
        </div>

        <Button
          type="button"
          onClick={openCreateModal}
          className="h-10 rounded-xl bg-primary px-4 text-primary-foreground hover:bg-secondary"
        >
          <Plus className="mr-2" size={16} />
          Add Event
        </Button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total events</p>
          <p className="mt-3 text-3xl font-semibold text-foreground">{summary.total}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Upcoming events</p>
          <p className="mt-3 text-3xl font-semibold text-foreground">{summary.upcoming}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total attendees</p>
          <p className="mt-3 text-3xl font-semibold text-foreground">{summary.attendees}</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Event</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Location</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Attendees</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-sm text-muted-foreground">
                    No events found yet. Add your first event to get started.
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-6 py-4 align-top">
                      <div className="font-medium text-foreground">{event.title}</div>
                      <div className="mt-1 max-w-md text-sm text-muted-foreground">
                        {event.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      <div>{formatDateTime(event.event_date)}</div>
                      <div className="mt-1 text-muted-foreground">
                        Ends: {formatDateTime(event.end_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{event.location}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusTone(
                          event.status as EventStatus
                        )}`}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {event.attendees_count}
                      {event.max_attendees ? ` / ${event.max_attendees}` : ''}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-lg"
                          onClick={() => openEditModal(event)}
                        >
                          <Edit className="mr-2" size={14} />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-lg border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setDeletingEvent(event)}
                        >
                          <Trash2 className="mr-2" size={14} />
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
      </div>

      <Modal
        open={isCreateOpen}
        onClose={() => closeCreateModal(false)}
        center
        classNames={{ modal: 'w-full max-w-4xl overflow-visible rounded-[2rem] bg-card p-0 text-foreground' }}
      >
        <form onSubmit={handleCreate} className="overflow-visible rounded-[2rem] bg-card">
          <div className="border-b border-border px-8 py-6">
            <h2 className="text-2xl font-semibold text-foreground">Create Event</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Add a new event with schedule, location, attendee limits, and SEO details.
            </p>
          </div>

          <div className="grid gap-5 px-8 py-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Title *</label>
              <Input name="title" value={formData.title} onChange={handleInputChange} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 dark:text-slate-200"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Event Date *</label>
                <Input
                  type="datetime-local"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">End Date</label>
                <Input
                  type="datetime-local"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-foreground">Location *</label>
                <Input name="location" value={formData.location} onChange={handleInputChange} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Status</label>
                <FormSelect
                  value={formData.status}
                  options={eventStatusOptions}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value || 'UPCOMING' }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2 space-y-4">
                <UploadField
                  label="Event Image"
                  value={formData.image_url}
                  onValueChange={(value) =>
                    handleInputChange({ target: { name: 'image_url', value } } as React.ChangeEvent<HTMLInputElement>)
                  }
                  uploadKind="image"
                  accept=".jpg,.jpeg,.png,.gif"
                />
                <MultiImageUploadField
                  label="Extra Images"
                  values={formData.extra_images}
                  onChange={(values) => setFormData((prev) => ({ ...prev, extra_images: values }))}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Max Attendees</label>
                <Input
                  type="number"
                  min="1"
                  name="max_attendees"
                  value={formData.max_attendees}
                  onChange={handleInputChange}
                  placeholder="250"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">SEO Title</label>
                <Input
                  name="seo_title"
                  value={formData.seo_title}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">SEO Description</label>
                <Input
                  name="seo_description"
                  value={formData.seo_description}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {formError && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {formError}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-border px-8 py-5">
            <Button type="button" variant="outline" onClick={() => closeCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-secondary">
              {submitting ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!editingEvent}
        onClose={() => closeEditModal(false)}
        center
        classNames={{ modal: 'w-full max-w-4xl overflow-visible rounded-[2rem] bg-card p-0 text-foreground' }}
      >
        <form onSubmit={handleEdit} className="overflow-visible rounded-[2rem] bg-card">
          <div className="border-b border-border px-8 py-6">
            <h2 className="text-2xl font-semibold text-foreground">Edit Event</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Update event schedule, visibility, and descriptive details.
            </p>
          </div>

          <div className="grid gap-5 px-8 py-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Title *</label>
              <Input name="title" value={formData.title} onChange={handleInputChange} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 dark:text-slate-200"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Event Date *</label>
                <Input
                  type="datetime-local"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">End Date</label>
                <Input
                  type="datetime-local"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-foreground">Location *</label>
                <Input name="location" value={formData.location} onChange={handleInputChange} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Status</label>
                <FormSelect
                  value={formData.status}
                  options={eventStatusOptions}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value || 'UPCOMING' }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2 space-y-4">
                <UploadField
                  label="Event Image"
                  value={formData.image_url}
                  onValueChange={(value) =>
                    handleInputChange({ target: { name: 'image_url', value } } as React.ChangeEvent<HTMLInputElement>)
                  }
                  uploadKind="image"
                  accept=".jpg,.jpeg,.png,.gif"
                />
                <MultiImageUploadField
                  label="Extra Images"
                  values={formData.extra_images}
                  onChange={(values) => setFormData((prev) => ({ ...prev, extra_images: values }))}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Max Attendees</label>
                <Input
                  type="number"
                  min="1"
                  name="max_attendees"
                  value={formData.max_attendees}
                  onChange={handleInputChange}
                  placeholder="250"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">SEO Title</label>
                <Input
                  name="seo_title"
                  value={formData.seo_title}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">SEO Description</label>
                <Input
                  name="seo_description"
                  value={formData.seo_description}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {formError && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {formError}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-border px-8 py-5">
            <Button type="button" variant="outline" onClick={() => closeEditModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-secondary">
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deletingEvent}
        onClose={() => closeDeleteModal(false)}
        center
        classNames={{ modal: 'w-full max-w-md rounded-[2rem] bg-card p-0 text-foreground' }}
      >
        <div className="rounded-[2rem] bg-card p-8">
          <h2 className="text-2xl font-semibold text-foreground">Delete Event</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Are you sure you want to delete{' '}
            <span className="font-medium text-foreground">{deletingEvent?.title || 'this event'}</span>
            ? This action cannot be undone.
          </p>

          <div className="mt-8 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => closeDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              {deleteSubmitting ? 'Deleting...' : 'Delete Event'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
