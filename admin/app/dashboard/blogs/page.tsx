'use client';

import 'react-responsive-modal/styles.css';

import { useEffect, useMemo, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import { Edit, FileText, Loader, Plus, Trash2 } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { FormSelect, type FormSelectOption } from '@/components/ui/form-select';
import { Input } from '@/components/ui/input';
import { MultiImageUploadField } from '@/components/ui/multi-image-upload-field';
import { UploadField } from '@/components/ui/upload-field';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { createBlog, deleteBlog, fetchBlogs, updateBlog } from '@/store/blogsSlice';
import type { Blog } from '@/types';

type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

type BlogFormState = {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  extra_images: string[];
  status: BlogStatus;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
};

const blogStatusOptions: FormSelectOption<BlogStatus>[] = [
  { value: 'DRAFT', label: 'DRAFT' },
  { value: 'PUBLISHED', label: 'PUBLISHED' },
  { value: 'ARCHIVED', label: 'ARCHIVED' },
];

const defaultFormState: BlogFormState = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  featured_image: '',
  extra_images: [],
  status: 'DRAFT',
  seo_title: '',
  seo_description: '',
  seo_keywords: '',
};

function getEditFormState(blog: Blog): BlogFormState {
  return {
    title: blog.title,
    slug: blog.slug,
    content: blog.content,
    excerpt: blog.excerpt || '',
    featured_image: blog.featured_image || '',
    extra_images: blog.extra_images || [],
    status: (blog.status as BlogStatus) || 'DRAFT',
    seo_title: blog.seo_title || '',
    seo_description: blog.seo_description || '',
    seo_keywords: blog.seo_keywords || '',
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
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

export default function BlogsPage() {
  const dispatch = useAppDispatch();
  const { items: blogs, loading, error } = useAppSelector((state) => state.blogs);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [deletingBlog, setDeletingBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState<BlogFormState>(defaultFormState);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchBlogs({}));
  }, [dispatch]);

  const summary = useMemo(
    () => ({
      total: blogs.length,
      published: blogs.filter((item) => item.status === 'PUBLISHED').length,
      totalViews: blogs.reduce((sum, item) => sum + (item.views_count || 0), 0),
    }),
    [blogs]
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

  const openEditModal = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData(getEditFormState(blog));
    setFormError('');
  };

  const closeEditModal = (open: boolean) => {
    if (!open) {
      setEditingBlog(null);
      setFormData(defaultFormState);
      setFormError('');
    }
  };

  const closeDeleteModal = (open: boolean) => {
    if (!open) {
      setDeletingBlog(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'title' && !editingBlog) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title || !formData.content) {
      setFormError('Title and content are required');
      return;
    }

    setSubmitting(true);
    const result = await dispatch(
      createBlog({
        title: formData.title,
        slug: formData.slug || undefined,
        content: formData.content,
        excerpt: formData.excerpt || undefined,
        featured_image: formData.featured_image || undefined,
        extra_images: formData.extra_images,
        status: formData.status,
        seo_title: formData.seo_title || undefined,
        seo_description: formData.seo_description || undefined,
        seo_keywords: formData.seo_keywords || undefined,
      })
    );
    setSubmitting(false);

    if (createBlog.fulfilled.match(result)) {
      closeCreateModal(false);
    } else {
      setFormError((result.payload as string) || 'Failed to create blog');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!editingBlog) {
      return;
    }

    if (!formData.title || !formData.content) {
      setFormError('Title and content are required');
      return;
    }

    setSubmitting(true);
    const result = await dispatch(
      updateBlog({
        id: editingBlog.id,
        data: {
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt || undefined,
          featured_image: formData.featured_image || undefined,
          extra_images: formData.extra_images,
          status: formData.status,
          seo_title: formData.seo_title || undefined,
          seo_description: formData.seo_description || undefined,
          seo_keywords: formData.seo_keywords || undefined,
        },
      })
    );
    setSubmitting(false);

    if (updateBlog.fulfilled.match(result)) {
      closeEditModal(false);
    } else {
      setFormError((result.payload as string) || 'Failed to update blog');
    }
  };

  const handleDelete = async () => {
    if (!deletingBlog) {
      return;
    }

    setDeleteSubmitting(true);
    const result = await dispatch(deleteBlog(deletingBlog.id));
    setDeleteSubmitting(false);

    if (deleteBlog.fulfilled.match(result)) {
      closeDeleteModal(false);
    }
  };

  if (loading && blogs.length === 0) {
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
          <h1 className="text-3xl font-bold text-foreground">Blogs Management</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create, publish, and manage blog posts with SEO metadata and featured images.
          </p>
        </div>

        <Button
          type="button"
          onClick={openCreateModal}
          className="h-10 rounded-xl bg-primary px-4 text-primary-foreground hover:bg-secondary"
        >
          <Plus size={18} />
          Add Blog
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total posts</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{summary.total}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Published posts</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{summary.published}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total views</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{summary.totalViews}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[1100px]">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Post</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Slug</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Views</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Published</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {blogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  No blog posts found
                </td>
              </tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 text-sm text-foreground">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-xl bg-primary/10 p-2 text-primary">
                        <FileText size={16} />
                      </div>
                      <div>
                        <div className="font-semibold">{blog.title}</div>
                        <div className="line-clamp-2 max-w-sm text-xs text-muted-foreground">
                          {blog.excerpt || blog.content}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{blog.slug}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        blog.status === 'PUBLISHED'
                          ? 'bg-secondary/15 text-secondary'
                          : blog.status === 'ARCHIVED'
                            ? 'bg-muted text-foreground'
                            : 'bg-accent/15 text-accent'
                      }`}
                    >
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{blog.views_count}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{formatDate(blog.published_at)}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(blog)}
                        className="rounded-lg border-border bg-muted text-foreground hover:bg-accent/20"
                      >
                        <Edit size={16} />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingBlog(blog)}
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
          <h2 className="text-2xl font-bold text-foreground">Create Blog Post</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Draft a new blog post with content, excerpt, status, and SEO information.
          </p>
        </div>
        <BlogForm
          formData={formData}
          formError={formError}
          loading={submitting}
          isEdit={false}
          onInputChange={handleInputChange}
          onExtraImagesChange={(values) => setFormData((prev) => ({ ...prev, extra_images: values }))}
          onStatusChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
          onSubmit={handleCreate}
          onCancel={() => closeCreateModal(false)}
        />
      </Modal>

      <Modal
        open={!!editingBlog}
        onClose={() => closeEditModal(false)}
        center
        classNames={{ modal: 'w-full max-w-4xl rounded-3xl bg-card p-0 text-foreground overflow-visible' }}
      >
        <div className="border-b border-border bg-card px-6 py-5 sm:px-8">
          <h2 className="text-2xl font-bold text-foreground">Edit Blog Post</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Update the post content, status, featured image, and SEO metadata.
          </p>
        </div>
        <BlogForm
          formData={formData}
          formError={formError}
          loading={submitting}
          isEdit
          onInputChange={handleInputChange}
          onExtraImagesChange={(values) => setFormData((prev) => ({ ...prev, extra_images: values }))}
          onStatusChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
          onSubmit={handleEdit}
          onCancel={() => closeEditModal(false)}
        />
      </Modal>

      <Modal
        open={!!deletingBlog}
        onClose={() => closeDeleteModal(false)}
        center
        classNames={{ modal: 'w-full max-w-md rounded-3xl bg-card p-0 text-foreground overflow-hidden' }}
      >
        <div className="border-b border-border bg-card px-6 py-5">
          <h2 className="text-2xl font-bold text-foreground">Delete Blog Post</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This will permanently remove the blog post.
          </p>
        </div>
        <div className="bg-card px-6 py-6 text-sm text-muted-foreground">
          Delete <span className="font-semibold text-foreground">{deletingBlog?.title}</span>? This action cannot be undone.
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

type BlogFormProps = {
  formData: BlogFormState;
  formError: string;
  loading: boolean;
  isEdit: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onExtraImagesChange: (values: string[]) => void;
  onStatusChange: (value: BlogStatus) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

function BlogForm({
  formData,
  formError,
  loading,
  isEdit,
  onInputChange,
  onExtraImagesChange,
  onStatusChange,
  onSubmit,
  onCancel,
}: BlogFormProps) {
  return (
    <form onSubmit={onSubmit} className="bg-card text-foreground">
      <div className="space-y-6 bg-card px-6 py-6 sm:px-8">
        {formError && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {formError}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Title *" htmlFor={`${isEdit ? 'edit' : 'create'}-title`}>
            <Input
              id={`${isEdit ? 'edit' : 'create'}-title`}
              name="title"
              value={formData.title}
              onChange={onInputChange}
              disabled={loading}
              className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
            />
          </Field>

          <Field label="Slug" htmlFor={`${isEdit ? 'edit' : 'create'}-slug`}>
            <Input
              id={`${isEdit ? 'edit' : 'create'}-slug`}
              name="slug"
              value={formData.slug}
              onChange={onInputChange}
              disabled={loading || isEdit}
              className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
            />
          </Field>
        </div>

        <div className="space-y-2">
          <label htmlFor={`${isEdit ? 'edit' : 'create'}-content`} className="text-sm font-semibold text-foreground">
            Content *
          </label>
          <textarea
            id={`${isEdit ? 'edit' : 'create'}-content`}
            name="content"
            value={formData.content}
            onChange={onInputChange}
            disabled={loading}
            rows={8}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-slate-700 shadow-none outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 dark:text-slate-200"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor={`${isEdit ? 'edit' : 'create'}-excerpt`} className="text-sm font-semibold text-foreground">
            Excerpt
          </label>
          <textarea
            id={`${isEdit ? 'edit' : 'create'}-excerpt`}
            name="excerpt"
            value={formData.excerpt}
            onChange={onInputChange}
            disabled={loading}
            rows={3}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-slate-700 shadow-none outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 dark:text-slate-200"
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <UploadField
              label="Featured Image"
              value={formData.featured_image}
              onValueChange={(value) =>
                onInputChange({ target: { name: 'featured_image', value } } as React.ChangeEvent<HTMLInputElement>)
              }
              uploadKind="image"
              accept=".jpg,.jpeg,.png,.gif"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <MultiImageUploadField
              label="Extra Images"
              values={formData.extra_images}
              onChange={onExtraImagesChange}
              disabled={loading}
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Status</label>
            <FormSelect<BlogStatus>
              inputId={`${isEdit ? 'edit' : 'create'}-blog-status`}
              options={blogStatusOptions}
              value={formData.status}
              onChange={onStatusChange}
              disabled={loading}
              placeholder="Select status"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="SEO Title" htmlFor={`${isEdit ? 'edit' : 'create'}-seo-title`}>
            <Input
              id={`${isEdit ? 'edit' : 'create'}-seo-title`}
              name="seo_title"
              value={formData.seo_title}
              onChange={onInputChange}
              disabled={loading}
              className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
            />
          </Field>

          <Field label="SEO Keywords" htmlFor={`${isEdit ? 'edit' : 'create'}-seo-keywords`}>
            <Input
              id={`${isEdit ? 'edit' : 'create'}-seo-keywords`}
              name="seo_keywords"
              value={formData.seo_keywords}
              onChange={onInputChange}
              disabled={loading}
              className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
            />
          </Field>
        </div>

        <div className="space-y-2">
          <label htmlFor={`${isEdit ? 'edit' : 'create'}-seo-description`} className="text-sm font-semibold text-foreground">
            SEO Description
          </label>
          <textarea
            id={`${isEdit ? 'edit' : 'create'}-seo-description`}
            name="seo_description"
            value={formData.seo_description}
            onChange={onInputChange}
            disabled={loading}
            rows={3}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-slate-700 shadow-none outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 dark:text-slate-200"
          />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border bg-card p-4 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground hover:bg-secondary">
          {loading ? (isEdit ? 'Saving...' : 'Creating...') : isEdit ? 'Save Changes' : 'Create Blog'}
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
