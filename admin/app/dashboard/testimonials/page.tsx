'use client';

import 'react-responsive-modal/styles.css';

import { useEffect, useMemo, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import { Edit, Loader, MessageSquare, Plus, Trash2 } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MultiImageUploadField } from '@/components/ui/multi-image-upload-field';
import { UploadField } from '@/components/ui/upload-field';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  createTestimonial,
  deleteTestimonial,
  fetchTestimonials,
  updateTestimonial,
} from '@/store/testimonialsSlice';
import type { Testimonial } from '@/types';

type TestimonialFormState = {
  author_name: string;
  author_role: string;
  content: string;
  image_url: string;
  extra_images: string[];
  rating: string;
};

const defaultFormState: TestimonialFormState = {
  author_name: '',
  author_role: '',
  content: '',
  image_url: '',
  extra_images: [],
  rating: '',
};

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

function getRatingLabel(rating?: number) {
  if (!rating) {
    return 'No rating';
  }
  return `${rating}/5`;
}

export default function TestimonialsPage() {
  const dispatch = useAppDispatch();
  const { items: testimonials, loading, error } = useAppSelector((state) => state.testimonials);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deletingTestimonial, setDeletingTestimonial] = useState<Testimonial | null>(null);
  const [approvingTestimonial, setApprovingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<TestimonialFormState>(defaultFormState);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionSubmitting, setActionSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchTestimonials({}));
  }, [dispatch]);

  const summary = useMemo(
    () => ({
      total: testimonials.length,
      approved: testimonials.filter((item) => item.is_approved).length,
      averageRating:
        testimonials.filter((item) => item.rating).length > 0
          ? (
              testimonials.reduce((sum, item) => sum + (item.rating || 0), 0) /
              testimonials.filter((item) => item.rating).length
            ).toFixed(1)
          : '0.0',
    }),
    [testimonials]
  );

  const closeCreateModal = (open: boolean) => {
    setIsCreateOpen(open);
    if (!open) {
      setFormData(defaultFormState);
      setFormError('');
    }
  };

  const closeDeleteModal = (open: boolean) => {
    if (!open) {
      setDeletingTestimonial(null);
    }
  };

  const closeApproveModal = (open: boolean) => {
    if (!open) {
      setApprovingTestimonial(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.author_name || !formData.content) {
      setFormError('Author name and testimonial content are required');
      return;
    }

    const parsedRating = formData.rating ? Number(formData.rating) : undefined;
    if (parsedRating && (parsedRating < 1 || parsedRating > 5)) {
      setFormError('Rating must be between 1 and 5');
      return;
    }

    setSubmitting(true);
    const result = await dispatch(
      createTestimonial({
        author_name: formData.author_name,
        author_role: formData.author_role || undefined,
        content: formData.content,
        image_url: formData.image_url || undefined,
        extra_images: formData.extra_images,
        rating: parsedRating,
      })
    );
    setSubmitting(false);

    if (createTestimonial.fulfilled.match(result)) {
      closeCreateModal(false);
    } else {
      setFormError((result.payload as string) || 'Failed to create testimonial');
    }
  };

  const handleApproveToggle = async () => {
    if (!approvingTestimonial) {
      return;
    }

    setActionSubmitting(true);
    const result = await dispatch(
      updateTestimonial({
        id: approvingTestimonial.id,
        data: {
          is_approved: !approvingTestimonial.is_approved,
        },
      })
    );
    setActionSubmitting(false);

    if (updateTestimonial.fulfilled.match(result)) {
      closeApproveModal(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingTestimonial) {
      return;
    }

    setActionSubmitting(true);
    const result = await dispatch(deleteTestimonial(deletingTestimonial.id));
    setActionSubmitting(false);

    if (deleteTestimonial.fulfilled.match(result)) {
      closeDeleteModal(false);
    }
  };

  if (loading && testimonials.length === 0) {
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
          <h1 className="text-3xl font-bold text-foreground">Testimonials Management</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Review donor and volunteer feedback, approve testimonials, and manage visibility.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => {
            setFormData(defaultFormState);
            setFormError('');
            setIsCreateOpen(true);
          }}
          className="h-10 rounded-xl bg-primary px-4 text-primary-foreground hover:bg-secondary"
        >
          <Plus size={18} />
          Add Testimonial
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total testimonials</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{summary.total}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Approved</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{summary.approved}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Average rating</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{summary.averageRating}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[1100px]">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Author</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Content</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Rating</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Submitted</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {testimonials.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  No testimonials found
                </td>
              </tr>
            ) : (
              testimonials.map((testimonial) => (
                <tr key={testimonial.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 text-sm text-foreground">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-xl bg-primary/10 p-2 text-primary">
                        <MessageSquare size={16} />
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.author_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {testimonial.author_role || 'No role provided'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    <p className="line-clamp-2 max-w-md">{testimonial.content}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {getRatingLabel(testimonial.rating)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        testimonial.is_approved
                          ? 'bg-secondary/15 text-secondary'
                          : 'bg-accent/15 text-accent'
                      }`}
                    >
                      {testimonial.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {formatDate(testimonial.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setApprovingTestimonial(testimonial)}
                        className="rounded-lg border-border bg-muted text-foreground hover:bg-accent/20"
                      >
                        <Edit size={16} />
                        {testimonial.is_approved ? 'Unapprove' : 'Approve'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingTestimonial(testimonial)}
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
        classNames={{ modal: 'w-full max-w-3xl rounded-[1.75rem] p-0 shadow-2xl' }}
      >
        <div className="bg-card text-foreground">
          <div className="border-b border-border px-8 py-6">
            <h2 className="text-2xl font-bold text-foreground">Create Testimonial</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Add a new testimonial submission for review and publication.
            </p>
          </div>

          <form onSubmit={handleCreate} className="space-y-6 px-8 py-6">
            {formError && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                {formError}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Author Name *</label>
                <Input
                  name="author_name"
                  value={formData.author_name}
                  onChange={handleInputChange}
                  placeholder="Name of the person giving the testimonial"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Author Role</label>
                <Input
                  name="author_role"
                  value={formData.author_role}
                  onChange={handleInputChange}
                  placeholder="Donor, volunteer, parent, supporter..."
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Testimonial Content *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={5}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/20"
                placeholder="Share the testimonial message..."
              />
            </div>

            <div className="space-y-4">
              <UploadField
                label="Testimonial Image"
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

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Rating</label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  placeholder="1 to 5"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-border pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => closeCreateModal(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-primary text-primary-foreground hover:bg-secondary"
              >
                {submitting ? 'Creating...' : 'Create Testimonial'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        open={Boolean(approvingTestimonial)}
        onClose={() => closeApproveModal(false)}
        center
        classNames={{ modal: 'w-full max-w-lg rounded-[1.5rem] p-0 shadow-2xl' }}
      >
        <div className="bg-card text-foreground">
          <div className="border-b border-border px-8 py-6">
            <h2 className="text-xl font-bold text-foreground">
              {approvingTestimonial?.is_approved ? 'Unapprove Testimonial' : 'Approve Testimonial'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {approvingTestimonial?.is_approved
                ? 'This testimonial will be hidden from the public approved list.'
                : 'This testimonial will be visible in the public approved list.'}
            </p>
          </div>

          <div className="space-y-4 px-8 py-6">
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <p className="font-semibold text-foreground">{approvingTestimonial?.author_name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{approvingTestimonial?.content}</p>
            </div>

            <div className="flex justify-end gap-3 border-t border-border pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => closeApproveModal(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleApproveToggle}
                disabled={actionSubmitting}
                className="rounded-xl bg-primary text-primary-foreground hover:bg-secondary"
              >
                {actionSubmitting
                  ? 'Saving...'
                  : approvingTestimonial?.is_approved
                    ? 'Unapprove'
                    : 'Approve'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(deletingTestimonial)}
        onClose={() => closeDeleteModal(false)}
        center
        classNames={{ modal: 'w-full max-w-lg rounded-[1.5rem] p-0 shadow-2xl' }}
      >
        <div className="bg-card text-foreground">
          <div className="border-b border-border px-8 py-6">
            <h2 className="text-xl font-bold text-foreground">Delete Testimonial</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This action cannot be undone.
            </p>
          </div>

          <div className="space-y-4 px-8 py-6">
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4">
              <p className="font-semibold text-foreground">{deletingTestimonial?.author_name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{deletingTestimonial?.content}</p>
            </div>

            <div className="flex justify-end gap-3 border-t border-border pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => closeDeleteModal(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDelete}
                disabled={actionSubmitting}
                className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {actionSubmitting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
