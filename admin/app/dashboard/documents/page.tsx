'use client';

import 'react-responsive-modal/styles.css';

import { useEffect, useMemo, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import { File, Loader, Plus, Trash2 } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UploadField } from '@/components/ui/upload-field';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { createDocument, deleteDocument, fetchDocuments } from '@/store/documentsSlice';
import type { Document, UploadedAsset } from '@/types';

type DocumentFormState = {
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  file_size: string;
  document_category: string;
};

const defaultFormState: DocumentFormState = {
  title: '',
  description: '',
  file_url: '',
  file_type: '',
  file_size: '',
  document_category: '',
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

function formatFileSize(bytes: number) {
  if (!bytes || Number.isNaN(bytes)) {
    return '-';
  }

  const sizes = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
  const value = bytes / 1024 ** index;

  return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${sizes[index]}`;
}

export default function DocumentsPage() {
  const dispatch = useAppDispatch();
  const { items: documents, loading, error } = useAppSelector((state) => state.documents);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deletingDocument, setDeletingDocument] = useState<Document | null>(null);
  const [formData, setFormData] = useState<DocumentFormState>(defaultFormState);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchDocuments({}));
  }, [dispatch]);

  const summary = useMemo(
    () => ({
      total: documents.length,
      categories: new Set(documents.map((item) => item.document_category).filter(Boolean)).size,
      totalSize: documents.reduce((sum, item) => sum + (item.file_size || 0), 0),
    }),
    [documents]
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
      setDeletingDocument(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title || !formData.file_url || !formData.file_type || !formData.file_size) {
      setFormError('Title, file URL, file type, and file size are required');
      return;
    }

    const fileSize = Number(formData.file_size);
    if (Number.isNaN(fileSize) || fileSize <= 0) {
      setFormError('File size must be greater than zero');
      return;
    }

    setSubmitting(true);
    const result = await dispatch(
      createDocument({
        title: formData.title,
        description: formData.description || undefined,
        file_url: formData.file_url,
        file_type: formData.file_type,
        file_size: fileSize,
        document_category: formData.document_category || undefined,
      })
    );
    setSubmitting(false);

    if (createDocument.fulfilled.match(result)) {
      closeCreateModal(false);
    } else {
      setFormError((result.payload as string) || 'Failed to create document');
    }
  };

  const handleDelete = async () => {
    if (!deletingDocument) {
      return;
    }

    setDeleteSubmitting(true);
    const result = await dispatch(deleteDocument(deletingDocument.id));
    setDeleteSubmitting(false);

    if (deleteDocument.fulfilled.match(result)) {
      closeDeleteModal(false);
    }
  };

  if (loading && documents.length === 0) {
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
          <h1 className="text-3xl font-bold text-foreground">Documents Management</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage downloadable files, organize categories, and track document metadata.
          </p>
        </div>

        <Button
          type="button"
          onClick={openCreateModal}
          className="h-10 rounded-xl bg-primary px-4 text-primary-foreground hover:bg-secondary"
        >
          <Plus className="mr-2" size={16} />
          Add Document
        </Button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total documents</p>
          <p className="mt-3 text-3xl font-semibold text-foreground">{summary.total}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Categories</p>
          <p className="mt-3 text-3xl font-semibold text-foreground">{summary.categories}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total file size</p>
          <p className="mt-3 text-3xl font-semibold text-foreground">
            {formatFileSize(summary.totalSize)}
          </p>
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Document</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Size</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Uploaded</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-sm text-muted-foreground">
                    No documents found yet. Add your first document to get started.
                  </td>
                </tr>
              ) : (
                documents.map((document) => (
                  <tr key={document.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-6 py-4 align-top">
                      <div className="font-medium text-foreground">{document.title}</div>
                      {document.description && (
                        <div className="mt-1 max-w-md text-sm text-muted-foreground">
                          {document.description}
                        </div>
                      )}
                      <a
                        href={document.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-sm text-primary hover:text-secondary"
                      >
                        Open file
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground uppercase">{document.file_type}</td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {document.document_category || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {formatFileSize(document.file_size)}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{formatDate(document.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-lg border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setDeletingDocument(document)}
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
        classNames={{ modal: 'w-full max-w-3xl overflow-visible rounded-[2rem] bg-card p-0 text-foreground' }}
      >
        <form onSubmit={handleCreate} className="overflow-visible rounded-[2rem] bg-card">
          <div className="border-b border-border px-8 py-6">
            <h2 className="text-2xl font-semibold text-foreground">Add Document</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Add a downloadable resource with file metadata and optional category details.
            </p>
          </div>

          <div className="grid gap-5 px-8 py-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Title *</label>
              <Input name="title" value={formData.title} onChange={handleInputChange} />
            </div>

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

            <UploadField
              label="Document File *"
              value={formData.file_url}
              onValueChange={(value) =>
                handleInputChange({ target: { name: 'file_url', value } } as React.ChangeEvent<HTMLInputElement>)
              }
              onClear={() =>
                setFormData((prev) => ({
                  ...prev,
                  file_url: '',
                  file_type: '',
                  file_size: '',
                }))
              }
              onUploaded={(asset: UploadedAsset) =>
                setFormData((prev) => ({
                  ...prev,
                  file_url: asset.file_url,
                  file_type: asset.extension,
                  file_size: String(asset.file_size),
                }))
              }
              uploadKind="document"
              accept=".pdf,.doc,.docx"
            />

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">File Type *</label>
                <Input
                  name="file_type"
                  value={formData.file_type}
                  onChange={handleInputChange}
                  placeholder="pdf"
                  readOnly
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">File Size (bytes) *</label>
                <Input
                  type="number"
                  min="1"
                  name="file_size"
                  value={formData.file_size}
                  onChange={handleInputChange}
                  placeholder="245760"
                  readOnly
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Category</label>
                <Input
                  name="document_category"
                  value={formData.document_category}
                  onChange={handleInputChange}
                  placeholder="Policies"
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
              {submitting ? 'Saving...' : 'Add Document'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deletingDocument}
        onClose={() => closeDeleteModal(false)}
        center
        classNames={{ modal: 'w-full max-w-md rounded-[2rem] bg-card p-0 text-foreground' }}
      >
        <div className="rounded-[2rem] bg-card p-8">
          <h2 className="text-2xl font-semibold text-foreground">Delete Document</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Are you sure you want to delete{' '}
            <span className="font-medium text-foreground">
              {deletingDocument?.title || 'this document'}
            </span>
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
              {deleteSubmitting ? 'Deleting...' : 'Delete Document'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
