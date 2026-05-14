'use client';

import 'react-responsive-modal/styles.css';

import { useEffect, useMemo, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import { Image, Loader, Plus, Trash2 } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UploadField } from '@/components/ui/upload-field';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { createGalleryImage, deleteGalleryImage, fetchGalleryImages } from '@/store/gallerySlice';
import type { GalleryImage } from '@/types';

type GalleryFormState = {
  title: string;
  description: string;
  image_url: string;
  alt_text: string;
  order: string;
};

const defaultFormState: GalleryFormState = {
  title: '',
  description: '',
  image_url: '',
  alt_text: '',
  order: '0',
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

export default function GalleryPage() {
  const dispatch = useAppDispatch();
  const { items: galleryImages, loading, error } = useAppSelector((state) => state.gallery);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deletingImage, setDeletingImage] = useState<GalleryImage | null>(null);
  const [formData, setFormData] = useState<GalleryFormState>(defaultFormState);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchGalleryImages({}));
  }, [dispatch]);

  const summary = useMemo(
    () => ({
      total: galleryImages.length,
      withAltText: galleryImages.filter((item) => item.alt_text?.trim()).length,
      latestUpload:
        galleryImages.length > 0
          ? galleryImages.reduce((latest, current) =>
              new Date(current.createdAt).getTime() > new Date(latest.createdAt).getTime()
                ? current
                : latest
            )
          : null,
    }),
    [galleryImages]
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

  const closeDeleteModal = (open: boolean) => {
    if (!open) {
      setDeletingImage(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title || !formData.image_url) {
      setFormError('Title and image URL are required');
      return;
    }

    const order = Number(formData.order || '0');
    if (Number.isNaN(order) || order < 0) {
      setFormError('Display order must be zero or greater');
      return;
    }

    setSubmitting(true);
    const result = await dispatch(
      createGalleryImage({
        title: formData.title,
        description: formData.description || undefined,
        image_url: formData.image_url,
        alt_text: formData.alt_text || undefined,
        order,
      })
    );
    setSubmitting(false);

    if (createGalleryImage.fulfilled.match(result)) {
      closeCreateModal(false);
    } else {
      setFormError((result.payload as string) || 'Failed to create gallery image');
    }
  };

  const handleDelete = async () => {
    if (!deletingImage) {
      return;
    }

    setDeleteSubmitting(true);
    const result = await dispatch(deleteGalleryImage(deletingImage.id));
    setDeleteSubmitting(false);

    if (deleteGalleryImage.fulfilled.match(result)) {
      closeDeleteModal(false);
    }
  };

  if (loading && galleryImages.length === 0) {
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
          <h1 className="text-3xl font-bold text-foreground">Gallery Management</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Organize gallery images with titles, alt text, and display order for your public site.
          </p>
        </div>

        <Button
          type="button"
          onClick={openCreateModal}
          className="h-10 rounded-xl bg-primary px-4 text-primary-foreground hover:bg-secondary"
        >
          <Plus className="mr-2" size={16} />
          Add Image
        </Button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total images</p>
          <p className="mt-3 text-3xl font-semibold text-foreground">{summary.total}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Images with alt text</p>
          <p className="mt-3 text-3xl font-semibold text-foreground">{summary.withAltText}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Latest upload</p>
          <p className="mt-3 text-lg font-semibold text-foreground">
            {summary.latestUpload ? summary.latestUpload.title : '-'}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {summary.latestUpload ? formatDate(summary.latestUpload.createdAt) : 'No uploads yet'}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {galleryImages.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-border bg-card px-6 py-16 text-center shadow-sm">
            <Image size={48} className="mx-auto text-muted-foreground" />
            <p className="mt-4 text-lg font-medium text-foreground">No gallery images yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Upload your first image to start building the public gallery.
            </p>
          </div>
        ) : (
          galleryImages.map((image) => (
            <div key={image.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="aspect-[16/10] bg-muted">
                <img
                  src={image.image_url}
                  alt={image.alt_text || image.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold text-foreground">{image.title}</h2>
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                      #{image.order}
                    </span>
                  </div>
                  {image.description && (
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{image.description}</p>
                  )}
                </div>

                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">Alt text:</span>{' '}
                    {image.alt_text || 'Not provided'}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Uploaded:</span>{' '}
                    {formatDate(image.createdAt)}
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-lg border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setDeletingImage(image)}
                  >
                    <Trash2 className="mr-2" size={14} />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        open={isCreateOpen}
        onClose={() => closeCreateModal(false)}
        center
        classNames={{ modal: 'w-full max-w-3xl overflow-visible rounded-[2rem] bg-card p-0 text-foreground' }}
      >
        <form onSubmit={handleCreate} className="overflow-visible rounded-[2rem] bg-card">
          <div className="border-b border-border px-8 py-6">
            <h2 className="text-2xl font-semibold text-foreground">Add Gallery Image</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Add a new image with descriptive metadata and display order for the gallery.
            </p>
          </div>

          <div className="grid gap-5 px-8 py-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Title *</label>
              <Input name="title" value={formData.title} onChange={handleInputChange} />
            </div>

            <UploadField
              label="Gallery Image *"
              value={formData.image_url}
              onValueChange={(value) =>
                handleInputChange({ target: { name: 'image_url', value } } as React.ChangeEvent<HTMLInputElement>)
              }
              uploadKind="image"
              accept=".jpg,.jpeg,.png,.gif"
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 dark:text-slate-200"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Alt Text</label>
                <Input
                  name="alt_text"
                  value={formData.alt_text}
                  onChange={handleInputChange}
                  placeholder="Describe the image for accessibility"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Display Order</label>
                <Input
                  type="number"
                  min="0"
                  name="order"
                  value={formData.order}
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
              {submitting ? 'Saving...' : 'Add Image'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deletingImage}
        onClose={() => closeDeleteModal(false)}
        center
        classNames={{ modal: 'w-full max-w-md rounded-[2rem] bg-card p-0 text-foreground' }}
      >
        <div className="rounded-[2rem] bg-card p-8">
          <h2 className="text-2xl font-semibold text-foreground">Delete Image</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Are you sure you want to delete{' '}
            <span className="font-medium text-foreground">{deletingImage?.title || 'this image'}</span>
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
              {deleteSubmitting ? 'Deleting...' : 'Delete Image'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
