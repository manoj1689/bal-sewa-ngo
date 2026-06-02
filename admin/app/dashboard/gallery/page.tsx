'use client';

import 'react-responsive-modal/styles.css';

import { useEffect, useMemo, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import { ArrowLeft, Edit, Image as ImageIcon, Loader, Plus, Trash2, Video } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { getMediaUrl } from '@/lib/media';
import {
  createGalleryBucket,
  createGalleryImage,
  deleteGalleryBucket,
  deleteGalleryImage,
  fetchGalleryBucketMedia,
  fetchGalleryBuckets,
  updateGalleryBucket,
  updateGalleryImage,
} from '@/store/gallerySlice';
import { uploadImage, uploadVideo } from '@/store/uploadsSlice';
import type { GalleryBucket, GalleryImage, UploadedAsset } from '@/types';

type GalleryMediaType = 'IMAGE' | 'VIDEO';
type GalleryStatus = 'DRAFT' | 'PUBLISHED';

type BucketFormState = {
  title: string;
  description: string;
  thumbnail_url: string;
  order: string;
  status: GalleryStatus;
};

type MediaFormState = {
  title: string;
  description: string;
  image_url: string;
  media_type: GalleryMediaType;
  thumbnail_url: string;
  alt_text: string;
  order: string;
  status: GalleryStatus;
};

type SelectedUploadFile = {
  file: File;
  title: string;
  previewUrl: string;
};

const defaultBucketForm: BucketFormState = {
  title: '',
  description: '',
  thumbnail_url: '',
  order: '0',
  status: 'PUBLISHED',
};

const defaultMediaForm: MediaFormState = {
  title: '',
  description: '',
  image_url: '',
  media_type: 'IMAGE',
  thumbnail_url: '',
  alt_text: '',
  order: '0',
  status: 'PUBLISHED',
};

function formatDate(date?: string) {
  if (!date) return '-';

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

function getAcceptValue(mediaType: GalleryMediaType) {
  if (mediaType === 'IMAGE') return '.jpg,.jpeg,.png,.gif,.webp';
  return '.mp4,.webm,.mov,.avi,.mkv';
}

function parseOrder(value: string) {
  const order = Number(value || '0');
  if (Number.isNaN(order) || order < 0) {
    throw new Error('Display order must be zero or greater');
  }
  return order;
}

export default function GalleryPage() {
  const dispatch = useAppDispatch();
  const {
    buckets,
    bucketsLoading,
    items: mediaItems,
    loading,
    error,
  } = useAppSelector((state) => state.gallery);

  const [selectedBucket, setSelectedBucket] = useState<GalleryBucket | null>(null);
  const [isBucketModalOpen, setIsBucketModalOpen] = useState(false);
  const [editingBucket, setEditingBucket] = useState<GalleryBucket | null>(null);
  const [deletingBucket, setDeletingBucket] = useState<GalleryBucket | null>(null);
  const [bucketForm, setBucketForm] = useState<BucketFormState>(defaultBucketForm);
  const [bucketThumbnailFile, setBucketThumbnailFile] = useState<File | null>(null);

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<GalleryImage | null>(null);
  const [deletingMedia, setDeletingMedia] = useState<GalleryImage | null>(null);
  const [mediaForm, setMediaForm] = useState<MediaFormState>(defaultMediaForm);
  const [selectedFiles, setSelectedFiles] = useState<SelectedUploadFile[]>([]);
  const [editingSelectedFileIndex, setEditingSelectedFileIndex] = useState<number | null>(null);
  const [videoThumbnailFile, setVideoThumbnailFile] = useState<File | null>(null);

  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
    label: string;
  } | null>(null);

  useEffect(() => {
    dispatch(fetchGalleryBuckets({}));
  }, [dispatch]);

  useEffect(() => {
    if (selectedBucket) {
      dispatch(fetchGalleryBucketMedia({ bucketId: selectedBucket.id }));
    }
  }, [dispatch, selectedBucket]);

  const summary = useMemo(
    () => ({
      buckets: buckets.length,
      media: mediaItems.length,
      images: mediaItems.filter((item) => (item.media_type || 'IMAGE') === 'IMAGE').length,
      videos: mediaItems.filter((item) => item.media_type === 'VIDEO').length,
    }),
    [buckets.length, mediaItems]
  );

  const resetBucketForm = () => {
    setBucketForm(defaultBucketForm);
    setBucketThumbnailFile(null);
    setEditingBucket(null);
    setFormError('');
  };

  const resetMediaForm = () => {
    selectedFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setMediaForm(defaultMediaForm);
    setSelectedFiles([]);
    setEditingSelectedFileIndex(null);
    setVideoThumbnailFile(null);
    setEditingMedia(null);
    setUploadProgress(null);
    setFormError('');
  };

  const uploadAsset = async (file: File, mediaType: GalleryMediaType) => {
    const action = mediaType === 'VIDEO' ? uploadVideo : uploadImage;
    const result = await dispatch(action({ file }));

    if (!action.fulfilled.match(result)) {
      throw new Error((result.payload as string) || `Failed to upload ${file.name}`);
    }

    const uploadedAsset = result.payload.data as UploadedAsset;
    if (!uploadedAsset?.file_url) {
      throw new Error(`Upload did not return a URL for ${file.name}`);
    }

    return uploadedAsset.file_url;
  };

  const openCreateBucket = () => {
    resetBucketForm();
    setIsBucketModalOpen(true);
  };

  const openEditBucket = (bucket: GalleryBucket) => {
    setEditingBucket(bucket);
    setBucketForm({
      title: bucket.title,
      description: bucket.description || '',
      thumbnail_url: bucket.thumbnail_url || '',
      order: String(bucket.order ?? 0),
      status: bucket.status || 'PUBLISHED',
    });
    setBucketThumbnailFile(null);
    setFormError('');
    setIsBucketModalOpen(true);
  };

  const handleBucketInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setBucketForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveBucket = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');

    if (!bucketForm.title.trim()) {
      setFormError('Bucket title is required');
      return;
    }

    try {
      setSubmitting(true);
      const thumbnailUrl = bucketThumbnailFile
        ? await uploadAsset(bucketThumbnailFile, 'IMAGE')
        : bucketForm.thumbnail_url || undefined;
      const payload = {
        title: bucketForm.title.trim(),
        description: bucketForm.description.trim() || undefined,
        thumbnail_url: thumbnailUrl,
        order: parseOrder(bucketForm.order),
        status: bucketForm.status,
      };

      const result = editingBucket
        ? await dispatch(updateGalleryBucket({ id: editingBucket.id, data: payload }))
        : await dispatch(createGalleryBucket(payload));

      if (createGalleryBucket.fulfilled.match(result) || updateGalleryBucket.fulfilled.match(result)) {
        const savedBucket = result.payload.data as GalleryBucket | undefined;
        if (selectedBucket && savedBucket?.id === selectedBucket.id) {
          setSelectedBucket(savedBucket);
        }
        setIsBucketModalOpen(false);
        resetBucketForm();
      } else {
        setFormError((result.payload as string) || 'Failed to save gallery bucket');
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save gallery bucket');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBucket = async () => {
    if (!deletingBucket) return;

    setSubmitting(true);
    const result = await dispatch(deleteGalleryBucket(deletingBucket.id));
    setSubmitting(false);

    if (deleteGalleryBucket.fulfilled.match(result)) {
      if (selectedBucket?.id === deletingBucket.id) {
        setSelectedBucket(null);
      }
      setDeletingBucket(null);
    }
  };

  const openCreateMedia = () => {
    resetMediaForm();
    setIsMediaModalOpen(true);
  };

  const openEditMedia = (item: GalleryImage) => {
    setEditingMedia(item);
    setMediaForm({
      title: item.title,
      description: item.description || '',
      image_url: item.image_url,
      media_type: item.media_type || 'IMAGE',
      thumbnail_url: item.thumbnail_url || '',
      alt_text: item.alt_text || '',
      order: String(item.order ?? 0),
      status: item.status || 'PUBLISHED',
    });
    setSelectedFiles([]);
    setVideoThumbnailFile(null);
    setFormError('');
    setIsMediaModalOpen(true);
  };

  const handleMediaInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setMediaForm((prev) => ({
      ...prev,
      [name]: value,
      alt_text: name === 'media_type' && value === 'VIDEO' ? '' : prev.alt_text,
    }));

    if (name === 'media_type') {
      selectedFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      setSelectedFiles([]);
      setEditingSelectedFileIndex(null);
      setVideoThumbnailFile(null);
    }
  };

  const handleSelectedFilesChange = (files: FileList | null) => {
    selectedFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    const fileList = Array.from(files || []);
    setSelectedFiles(
      fileList.map((file, index) => ({
        file,
        title: `${mediaForm.title.trim() || file.name.replace(/\.[^/.]+$/, '')}${fileList.length > 1 ? ` ${index + 1}` : ''}`,
        previewUrl: URL.createObjectURL(file),
      }))
    );
    setEditingSelectedFileIndex(fileList.length > 0 ? 0 : null);
  };

  const handleSelectedFileTitleChange = (index: number, title: string) => {
    setSelectedFiles((items) =>
      items.map((item, itemIndex) => (itemIndex === index ? { ...item, title } : item))
    );
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((items) => {
      const itemToRemove = items[index];
      if (itemToRemove) {
        URL.revokeObjectURL(itemToRemove.previewUrl);
      }
      return items.filter((_, itemIndex) => itemIndex !== index);
    });
    setEditingSelectedFileIndex((currentIndex) => {
      if (currentIndex === null) return null;
      if (currentIndex === index) return null;
      return currentIndex > index ? currentIndex - 1 : currentIndex;
    });
  };

  const buildMediaPayload = (
    imageUrl: string,
    order: number,
    mediaType: GalleryMediaType,
    thumbnailUrl?: string,
    title?: string
  ) => ({
    title: title || mediaForm.title.trim(),
    description: mediaForm.description.trim() || undefined,
    image_url: imageUrl,
    media_type: mediaType,
    thumbnail_url: mediaType === 'VIDEO' ? thumbnailUrl || mediaForm.thumbnail_url || undefined : undefined,
    alt_text: mediaType === 'IMAGE' ? mediaForm.alt_text.trim() || undefined : undefined,
    order,
    status: mediaForm.status,
    bucket_id: selectedBucket?.id,
  });

  const handleSaveMedia = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');

    if (!selectedBucket) {
      setFormError('Open a gallery bucket before adding media');
      return;
    }
    if (!mediaForm.title.trim()) {
      setFormError('Media title is required');
      return;
    }
    if (!editingMedia && selectedFiles.length === 0) {
      setFormError('Select one or more files');
      return;
    }

    try {
      setSubmitting(true);
      setUploadProgress({
        current: editingMedia ? 1 : 0,
        total: editingMedia ? 1 : selectedFiles.length,
        label: editingMedia ? 'Saving media...' : `Uploading 0 of ${selectedFiles.length} files...`,
      });
      const baseOrder = parseOrder(mediaForm.order);
      const thumbnailUrl =
        mediaForm.media_type === 'VIDEO' && videoThumbnailFile
          ? await uploadAsset(videoThumbnailFile, 'IMAGE')
          : mediaForm.thumbnail_url || undefined;

      if (editingMedia) {
        const result = await dispatch(
          updateGalleryImage({
            id: editingMedia.id,
            data: buildMediaPayload(mediaForm.image_url, baseOrder, mediaForm.media_type, thumbnailUrl),
          })
        );
        if (!updateGalleryImage.fulfilled.match(result)) {
          throw new Error((result.payload as string) || 'Failed to update media');
        }
      } else {
        for (const [index, item] of selectedFiles.entries()) {
          if (!item.file) throw new Error('Please reselect files before uploading');
          setUploadProgress({
            current: index + 1,
            total: selectedFiles.length,
            label: `Uploading ${index + 1} of ${selectedFiles.length}: ${item.title || item.file.name}`,
          });
          const imageUrl = await uploadAsset(item.file, mediaForm.media_type);
          const result = await dispatch(
            createGalleryImage(
              buildMediaPayload(
                imageUrl,
                baseOrder + index,
                mediaForm.media_type,
                thumbnailUrl,
                item.title.trim() || `${mediaForm.title.trim()} ${index + 1}`
              )
            )
          );
          if (!createGalleryImage.fulfilled.match(result)) {
            throw new Error((result.payload as string) || `Failed to create media for ${item.file.name}`);
          }
        }
      }

      setUploadProgress({
        current: editingMedia ? 1 : selectedFiles.length,
        total: editingMedia ? 1 : selectedFiles.length,
        label: 'Refreshing gallery...',
      });
      await dispatch(fetchGalleryBucketMedia({ bucketId: selectedBucket.id }));
      setIsMediaModalOpen(false);
      resetMediaForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save gallery media');
    } finally {
      setSubmitting(false);
      setUploadProgress(null);
    }
  };

  const handleDeleteMedia = async () => {
    if (!deletingMedia || !selectedBucket) return;

    setSubmitting(true);
    const result = await dispatch(deleteGalleryImage(deletingMedia.id));
    setSubmitting(false);

    if (deleteGalleryImage.fulfilled.match(result)) {
      setDeletingMedia(null);
      dispatch(fetchGalleryBucketMedia({ bucketId: selectedBucket.id }));
    }
  };

  const renderBucketThumbnail = (bucket: GalleryBucket) => {
    if (bucket.thumbnail_url) {
      return (
        <img
          src={getMediaUrl(bucket.thumbnail_url)}
          alt={bucket.title}
          className="h-full w-full object-cover"
        />
      );
    }

    return (
      <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
        <ImageIcon size={40} />
      </div>
    );
  };

  const renderMediaPreview = (item: GalleryImage) => {
    if ((item.media_type || 'IMAGE') === 'VIDEO') {
      return (
        <video
          src={getMediaUrl(item.image_url)}
          poster={item.thumbnail_url ? getMediaUrl(item.thumbnail_url) : undefined}
          controls
          className="h-full w-full bg-black object-cover"
        />
      );
    }

    return (
      <img
        src={getMediaUrl(item.image_url)}
        alt={item.alt_text || item.title}
        className="h-full w-full object-cover"
      />
    );
  };

  const renderHeader = () => (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        {selectedBucket && (
          <Button type="button" variant="outline" size="sm" className="mb-4" onClick={() => setSelectedBucket(null)}>
            <ArrowLeft className="mr-2" size={14} />
            Back to Buckets
          </Button>
        )}
        <h1 className="text-3xl font-bold text-foreground">
          {selectedBucket ? selectedBucket.title : 'Gallery Management'}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {selectedBucket
            ? selectedBucket.description || 'Upload and manage images and videos inside this gallery bucket.'
            : 'Create gallery buckets first, then open a bucket to upload images and videos inside it.'}
        </p>
      </div>

      <Button
        type="button"
        onClick={selectedBucket ? openCreateMedia : openCreateBucket}
        className="h-10 rounded-xl bg-primary px-4 text-primary-foreground hover:bg-secondary"
      >
        <Plus className="mr-2" size={16} />
        {selectedBucket ? 'Add Media' : 'Create Gallery Bucket'}
      </Button>
    </div>
  );

  const renderBucketView = () => (
    <>
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Gallery buckets</p>
          <p className="mt-3 text-3xl font-semibold text-foreground">{summary.buckets}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Published buckets</p>
          <p className="mt-3 text-3xl font-semibold text-foreground">
            {buckets.filter((bucket) => (bucket.status || 'PUBLISHED') === 'PUBLISHED').length}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Latest bucket</p>
          <p className="mt-3 truncate text-lg font-semibold text-foreground">
            {buckets[0]?.title || '-'}
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {buckets.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-border bg-card px-6 py-16 text-center shadow-sm">
            <ImageIcon size={48} className="mx-auto text-muted-foreground" />
            <p className="mt-4 text-lg font-medium text-foreground">No gallery buckets yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Create a bucket with a title, description, and thumbnail before uploading media.
            </p>
          </div>
        ) : (
          buckets.map((bucket) => (
            <div key={bucket.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <button
                type="button"
                onClick={() => setSelectedBucket(bucket)}
                className="aspect-[16/9] w-full bg-muted text-left"
              >
                {renderBucketThumbnail(bucket)}
              </button>
              <div className="space-y-4 p-5">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold text-foreground">{bucket.title}</h2>
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                      Order {bucket.order}
                    </span>
                  </div>
                  {bucket.description && (
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{bucket.description}</p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">Created {formatDate(bucket.createdAt)}</p>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setSelectedBucket(bucket)}>
                    Open
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => openEditBucket(bucket)}>
                    <Edit className="mr-2" size={14} />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setDeletingBucket(bucket)}
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
    </>
  );

  const renderMediaView = () => (
    <>
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total media</p>
          <p className="mt-3 text-3xl font-semibold text-foreground">{summary.media}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Images</p>
          <p className="mt-3 text-3xl font-semibold text-foreground">{summary.images}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Videos</p>
          <p className="mt-3 text-3xl font-semibold text-foreground">{summary.videos}</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {mediaItems.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-border bg-card px-6 py-16 text-center shadow-sm">
            <ImageIcon size={48} className="mx-auto text-muted-foreground" />
            <p className="mt-4 text-lg font-medium text-foreground">No media inside this bucket yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Upload images or videos into this gallery bucket.
            </p>
          </div>
        ) : (
          mediaItems.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="aspect-[16/10] bg-muted">{renderMediaPreview(item)}</div>
              <div className="space-y-4 p-5">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold text-foreground">{item.title}</h2>
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                      Order {item.order}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {(item.media_type || 'IMAGE') === 'VIDEO' ? <Video className="mr-1" size={12} /> : <ImageIcon className="mr-1" size={12} />}
                      {item.media_type || 'IMAGE'}
                    </span>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      {item.status || 'PUBLISHED'}
                    </span>
                  </div>
                  {item.description && (
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  )}
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => openEditMedia(item)}>
                    <Edit className="mr-2" size={14} />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setDeletingMedia(item)}
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
    </>
  );

  const renderBucketModal = () => (
    <Modal
      open={isBucketModalOpen}
      onClose={() => {
        setIsBucketModalOpen(false);
        resetBucketForm();
      }}
      center
      classNames={{ modal: 'w-full max-w-2xl overflow-visible rounded-[2rem] bg-card p-0 text-foreground' }}
    >
      <form onSubmit={handleSaveBucket} className="overflow-visible rounded-[2rem] bg-card">
        <div className="border-b border-border px-8 py-6">
          <h2 className="text-2xl font-semibold text-foreground">
            {editingBucket ? 'Edit Gallery Bucket' : 'Create Gallery Bucket'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create the folder first. Media uploads happen after opening the bucket.
          </p>
        </div>

        <div className="grid gap-5 px-8 py-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Title *</label>
              <Input name="title" value={bucketForm.title} onChange={handleBucketInputChange} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Display Order</label>
              <Input type="number" min="0" name="order" value={bucketForm.order} onChange={handleBucketInputChange} />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Thumbnail Image</label>
            <Input
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.webp"
              onChange={(event) => setBucketThumbnailFile(event.target.files?.[0] || null)}
              className="h-11"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {bucketThumbnailFile?.name || bucketForm.thumbnail_url || 'Select a cover image for this gallery bucket'}
            </p>
          </div>

          {editingBucket && (
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Thumbnail URL</label>
              <Input name="thumbnail_url" value={bucketForm.thumbnail_url} onChange={handleBucketInputChange} />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Description</label>
            <textarea
              name="description"
              value={bucketForm.description}
              onChange={handleBucketInputChange}
              rows={4}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 dark:text-slate-200"
            />
          </div>

          {formError && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {formError}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-border px-8 py-5">
          <Button type="button" variant="outline" onClick={() => setIsBucketModalOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-secondary">
            {submitting ? 'Saving...' : editingBucket ? 'Save Bucket' : 'Create Bucket'}
          </Button>
        </div>
      </form>
    </Modal>
  );

  const renderMediaModal = () => (
    <Modal
      open={isMediaModalOpen}
      onClose={() => {
        if (submitting) return;
        setIsMediaModalOpen(false);
        resetMediaForm();
      }}
      center
      classNames={{ modal: 'w-full max-w-3xl overflow-visible rounded-[2rem] bg-card p-0 text-foreground' }}
    >
      <form onSubmit={handleSaveMedia} className="relative overflow-visible rounded-[2rem] bg-card">
        {uploadProgress && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[2rem] bg-card/85 px-8 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 text-center shadow-lg">
              <Loader className="mx-auto animate-spin text-primary" size={32} />
              <p className="mt-4 text-sm font-medium text-foreground">{uploadProgress.label}</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${Math.round((uploadProgress.current / Math.max(uploadProgress.total, 1)) * 100)}%`,
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Please wait until all files are uploaded.
              </p>
            </div>
          </div>
        )}
        <div className="border-b border-border px-8 py-6">
          <h2 className="text-2xl font-semibold text-foreground">
            {editingMedia ? 'Edit Bucket Media' : 'Add Media to Bucket'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload images or videos inside {selectedBucket?.title || 'this gallery bucket'}.
          </p>
        </div>

        <div className="grid gap-5 px-8 py-6">
          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Media Type</label>
              <select
                name="media_type"
                value={mediaForm.media_type}
                onChange={handleMediaInputChange}
                disabled={!!editingMedia || submitting}
                className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
              >
                <option value="IMAGE">Images only</option>
                <option value="VIDEO">Videos only</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Status</label>
              <select
                name="status"
                value={mediaForm.status}
                onChange={handleMediaInputChange}
                disabled={submitting}
                className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
              >
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Display Order</label>
              <Input type="number" min="0" name="order" value={mediaForm.order} onChange={handleMediaInputChange} disabled={submitting} />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Title *</label>
            <Input name="title" value={mediaForm.title} onChange={handleMediaInputChange} disabled={submitting} />
          </div>

          {!editingMedia && (
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                {mediaForm.media_type === 'IMAGE' ? 'Image Files *' : 'Video Files *'}
              </label>
              <Input
                type="file"
                accept={getAcceptValue(mediaForm.media_type)}
                multiple
                onChange={(event) => handleSelectedFilesChange(event.target.files)}
                disabled={submitting}
                className="h-11"
              />
              {selectedFiles.length > 0 && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {selectedFiles.map((item, index) => (
                    <div key={`${item.file?.name || 'selected-file'}-${index}`} className="rounded-2xl border border-border bg-muted/30 p-3">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          {editingSelectedFileIndex === index ? (
                            <Input
                              value={item.title}
                              onChange={(event) => handleSelectedFileTitleChange(index, event.target.value)}
                              onBlur={() => setEditingSelectedFileIndex(null)}
                              className="h-9"
                              autoFocus
                            />
                          ) : (
                            <p className="truncate text-sm font-medium text-foreground">
                              {item.title || item.file?.name || 'Selected file'}
                            </p>
                          )}
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingSelectedFileIndex(index)}
                            disabled={submitting}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
                            aria-label={`Edit ${item.title || item.file?.name || 'selected file'}`}
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeSelectedFile(index)}
                            disabled={submitting}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-destructive transition hover:bg-destructive/10"
                            aria-label={`Remove ${item.title || item.file?.name || 'selected file'}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="h-28 overflow-hidden rounded-xl bg-background">
                        {item.previewUrl && mediaForm.media_type === 'VIDEO' ? (
                          <video src={item.previewUrl} className="h-full w-full object-cover" muted />
                        ) : item.previewUrl ? (
                          <img
                            src={item.previewUrl}
                            alt={item.title || item.file?.name || 'Selected file preview'}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                            Preview
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {mediaForm.media_type === 'VIDEO' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Shared Video Thumbnail</label>
              <Input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(event) => setVideoThumbnailFile(event.target.files?.[0] || null)}
                disabled={submitting}
                className="h-11"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                {videoThumbnailFile?.name || mediaForm.thumbnail_url || 'Optional poster image for the video preview'}
              </p>
            </div>
          )}

          {editingMedia && (
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Media URL</label>
              <Input name="image_url" value={mediaForm.image_url} onChange={handleMediaInputChange} disabled={submitting} />
            </div>
          )}

          {mediaForm.media_type === 'IMAGE' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Alt Text</label>
              <Input
                name="alt_text"
                value={mediaForm.alt_text}
                onChange={handleMediaInputChange}
                placeholder="Describe the image for accessibility"
                disabled={submitting}
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Description</label>
            <textarea
              name="description"
              value={mediaForm.description}
              onChange={handleMediaInputChange}
              disabled={submitting}
              rows={4}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 dark:text-slate-200"
            />
          </div>

          {formError && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {formError}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-border px-8 py-5">
          <Button type="button" variant="outline" onClick={() => setIsMediaModalOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-secondary" disabled={submitting}>
            {submitting ? 'Uploading...' : editingMedia ? 'Save Media' : 'Add Media'}
          </Button>
        </div>
      </form>
    </Modal>
  );

  if ((bucketsLoading && buckets.length === 0) || (loading && selectedBucket && mediaItems.length === 0)) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div>
      {renderHeader()}

      {error && (
        <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {selectedBucket ? renderMediaView() : renderBucketView()}
      {renderBucketModal()}
      {renderMediaModal()}

      <Modal
        open={!!deletingBucket}
        onClose={() => setDeletingBucket(null)}
        center
        classNames={{ modal: 'w-full max-w-md rounded-[2rem] bg-card p-0 text-foreground' }}
      >
        <div className="rounded-[2rem] bg-card p-8">
          <h2 className="text-2xl font-semibold text-foreground">Delete Bucket</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Delete <span className="font-medium text-foreground">{deletingBucket?.title}</span>? Media inside this bucket will remain in storage but lose this bucket grouping.
          </p>
          <div className="mt-8 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setDeletingBucket(null)}>
              Cancel
            </Button>
            <Button type="button" className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDeleteBucket}>
              {submitting ? 'Deleting...' : 'Delete Bucket'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!deletingMedia}
        onClose={() => setDeletingMedia(null)}
        center
        classNames={{ modal: 'w-full max-w-md rounded-[2rem] bg-card p-0 text-foreground' }}
      >
        <div className="rounded-[2rem] bg-card p-8">
          <h2 className="text-2xl font-semibold text-foreground">Delete Media</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Delete <span className="font-medium text-foreground">{deletingMedia?.title}</span>? This action cannot be undone.
          </p>
          <div className="mt-8 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setDeletingMedia(null)}>
              Cancel
            </Button>
            <Button type="button" className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDeleteMedia}>
              {submitting ? 'Deleting...' : 'Delete Media'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
