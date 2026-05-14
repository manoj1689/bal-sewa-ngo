'use client';

import 'react-responsive-modal/styles.css';

import { useEffect, useMemo, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import { Edit, Loader, Megaphone, Plus, Trash2 } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  createCampaign,
  deleteCampaign,
  fetchCampaigns,
  updateCampaign,
} from '@/store/campaignsSlice';
import type { Campaign } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormSelect, type FormSelectOption } from '@/components/ui/form-select';
import { Input } from '@/components/ui/input';
import { MultiImageUploadField } from '@/components/ui/multi-image-upload-field';
import { UploadField } from '@/components/ui/upload-field';

type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'COMPLETED';

type CampaignCreateFormState = {
  title: string;
  description: string;
  goal_amount: string;
  start_date: string;
  end_date: string;
  image_url: string;
  extra_images: string[];
  status: CampaignStatus;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
};

type CampaignEditFormState = {
  title: string;
  description: string;
  goal_amount: string;
  end_date: string;
  image_url: string;
  extra_images: string[];
  status: CampaignStatus;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
};

const createDefaultFormState: CampaignCreateFormState = {
  title: '',
  description: '',
  goal_amount: '',
  start_date: '',
  end_date: '',
  image_url: '',
  extra_images: [],
  status: 'DRAFT',
  is_featured: false,
  seo_title: '',
  seo_description: '',
};

const editDefaultFormState: CampaignEditFormState = {
  title: '',
  description: '',
  goal_amount: '',
  end_date: '',
  image_url: '',
  extra_images: [],
  status: 'DRAFT',
  is_featured: false,
  seo_title: '',
  seo_description: '',
};

const campaignStatusOptions: FormSelectOption<CampaignStatus>[] = [
  { value: 'DRAFT', label: 'DRAFT' },
  { value: 'ACTIVE', label: 'ACTIVE' },
  { value: 'INACTIVE', label: 'INACTIVE' },
  { value: 'COMPLETED', label: 'COMPLETED' },
];

function getEditFormState(campaign: Campaign): CampaignEditFormState {
  return {
    title: campaign.title,
    description: campaign.description,
    goal_amount: String(campaign.goal_amount ?? ''),
    end_date: campaign.end_date ? campaign.end_date.slice(0, 10) : '',
    image_url: campaign.image_url || '',
    extra_images: campaign.extra_images || [],
    status: (campaign.status as CampaignStatus) || 'DRAFT',
    is_featured: !!campaign.is_featured,
    seo_title: campaign.seo_title || '',
    seo_description: campaign.seo_description || '',
  };
}

function formatCurrency(amount: number) {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `INR ${amount}`;
  }
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

export default function CampaignsPage() {
  const dispatch = useAppDispatch();
  const { items: campaigns, loading, error } = useAppSelector((state) => state.campaigns);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(null);
  const [createForm, setCreateForm] = useState<CampaignCreateFormState>(createDefaultFormState);
  const [editForm, setEditForm] = useState<CampaignEditFormState>(editDefaultFormState);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchCampaigns({}));
  }, [dispatch]);

  const summary = useMemo(() => {
    return {
      activeCount: campaigns.filter((item) => item.status === 'ACTIVE').length,
      featuredCount: campaigns.filter((item) => item.is_featured).length,
      totalGoal: campaigns.reduce((sum, item) => sum + (item.goal_amount || 0), 0),
    };
  }, [campaigns]);

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

  const openEditModal = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setEditForm(getEditFormState(campaign));
    setFormError('');
  };

  const closeEditModal = (open: boolean) => {
    if (!open) {
      setEditingCampaign(null);
      setEditForm(editDefaultFormState);
      setFormError('');
    }
  };

  const closeDeleteModal = (open: boolean) => {
    if (!open) {
      setDeletingCampaign(null);
    }
  };

  const handleCreateInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!createForm.title || !createForm.description || !createForm.goal_amount || !createForm.start_date) {
      setFormError('Title, description, goal amount, and start date are required');
      return;
    }

    const goalAmount = Number(createForm.goal_amount);
    if (Number.isNaN(goalAmount) || goalAmount <= 0) {
      setFormError('Goal amount must be greater than zero');
      return;
    }

    setSubmitting(true);
    const result = await dispatch(
      createCampaign({
        title: createForm.title,
        description: createForm.description,
        goal_amount: goalAmount,
        start_date: new Date(createForm.start_date).toISOString(),
        end_date: createForm.end_date ? new Date(createForm.end_date).toISOString() : undefined,
        image_url: createForm.image_url || undefined,
        extra_images: createForm.extra_images,
        status: createForm.status,
        is_featured: createForm.is_featured,
        seo_title: createForm.seo_title || undefined,
        seo_description: createForm.seo_description || undefined,
      })
    );
    setSubmitting(false);

    if (createCampaign.fulfilled.match(result)) {
      closeCreateModal(false);
    } else {
      setFormError((result.payload as string) || 'Failed to create campaign');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!editingCampaign) {
      return;
    }

    if (!editForm.title || !editForm.description || !editForm.goal_amount) {
      setFormError('Title, description, and goal amount are required');
      return;
    }

    const goalAmount = Number(editForm.goal_amount);
    if (Number.isNaN(goalAmount) || goalAmount <= 0) {
      setFormError('Goal amount must be greater than zero');
      return;
    }

    setSubmitting(true);
    const result = await dispatch(
      updateCampaign({
        id: editingCampaign.id,
        data: {
          title: editForm.title,
          description: editForm.description,
          goal_amount: goalAmount,
          end_date: editForm.end_date ? new Date(editForm.end_date).toISOString() : undefined,
          image_url: editForm.image_url || undefined,
          extra_images: editForm.extra_images,
          status: editForm.status,
          is_featured: editForm.is_featured,
          seo_title: editForm.seo_title || undefined,
          seo_description: editForm.seo_description || undefined,
        },
      })
    );
    setSubmitting(false);

    if (updateCampaign.fulfilled.match(result)) {
      closeEditModal(false);
    } else {
      setFormError((result.payload as string) || 'Failed to update campaign');
    }
  };

  const handleDelete = async () => {
    if (!deletingCampaign) {
      return;
    }

    setDeleteSubmitting(true);
    const result = await dispatch(deleteCampaign(deletingCampaign.id));
    setDeleteSubmitting(false);

    if (deleteCampaign.fulfilled.match(result)) {
      closeDeleteModal(false);
    }
  };

  if (loading && campaigns.length === 0) {
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
          <h1 className="text-3xl font-bold text-foreground">Campaigns Management</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create fundraising campaigns, monitor goals, and manage campaign visibility.
          </p>
        </div>

        <Button
          type="button"
          onClick={openCreateModal}
          className="h-10 rounded-xl bg-primary px-4 text-primary-foreground hover:bg-secondary"
        >
          <Plus size={18} />
          Add Campaign
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total campaigns</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{campaigns.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Active campaigns</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{summary.activeCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total goal amount</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{formatCurrency(summary.totalGoal)}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[1040px]">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Campaign</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Goal</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Raised</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Dates</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  No campaigns found
                </td>
              </tr>
            ) : (
              campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 text-sm text-foreground">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-xl bg-primary/10 p-2 text-primary">
                        <Megaphone size={16} />
                      </div>
                      <div>
                        <div className="font-semibold">{campaign.title}</div>
                        <div className="line-clamp-2 max-w-xs text-xs text-muted-foreground">
                          {campaign.description}
                        </div>
                        {campaign.is_featured && (
                          <span className="mt-2 inline-flex rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-medium text-accent">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{formatCurrency(campaign.goal_amount)}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{formatCurrency(campaign.raised_amount)}</td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    <div>{formatDate(campaign.start_date)}</div>
                    <div className="text-xs text-muted-foreground">to {formatDate(campaign.end_date)}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        campaign.status === 'ACTIVE'
                          ? 'bg-secondary/15 text-secondary'
                          : campaign.status === 'COMPLETED'
                            ? 'bg-primary/15 text-primary'
                            : campaign.status === 'INACTIVE'
                              ? 'bg-destructive/10 text-destructive'
                              : 'bg-muted text-foreground'
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(campaign)}
                        className="rounded-lg border-border bg-muted text-foreground hover:bg-accent/20"
                      >
                        <Edit size={16} />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingCampaign(campaign)}
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
        classNames={{ modal: 'w-full max-w-3xl rounded-3xl bg-card p-0 text-foreground overflow-visible' }}
      >
        <div className="border-b border-border bg-card px-6 py-5 sm:px-8">
          <h2 className="text-2xl font-bold text-foreground">Create Campaign</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Launch a new fundraising campaign with goal, schedule, and visibility settings.
          </p>
        </div>
        <CampaignCreateForm
          formData={createForm}
          formError={formError}
          loading={submitting}
          onInputChange={handleCreateInputChange}
          onExtraImagesChange={(values) => setCreateForm((prev) => ({ ...prev, extra_images: values }))}
          onStatusChange={(value) => setCreateForm((prev) => ({ ...prev, status: value }))}
          onFeaturedChange={(checked) => setCreateForm((prev) => ({ ...prev, is_featured: checked }))}
          onSubmit={handleCreate}
          onCancel={() => closeCreateModal(false)}
        />
      </Modal>

      <Modal
        open={!!editingCampaign}
        onClose={() => closeEditModal(false)}
        center
        classNames={{ modal: 'w-full max-w-3xl rounded-3xl bg-card p-0 text-foreground overflow-visible' }}
      >
        <div className="border-b border-border bg-card px-6 py-5 sm:px-8">
          <h2 className="text-2xl font-bold text-foreground">Edit Campaign</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Update campaign details, goal amount, status, and feature visibility.
          </p>
        </div>
        <CampaignEditForm
          formData={editForm}
          formError={formError}
          loading={submitting}
          onInputChange={handleEditInputChange}
          onExtraImagesChange={(values) => setEditForm((prev) => ({ ...prev, extra_images: values }))}
          onStatusChange={(value) => setEditForm((prev) => ({ ...prev, status: value }))}
          onFeaturedChange={(checked) => setEditForm((prev) => ({ ...prev, is_featured: checked }))}
          onSubmit={handleEdit}
          onCancel={() => closeEditModal(false)}
        />
      </Modal>

      <Modal
        open={!!deletingCampaign}
        onClose={() => closeDeleteModal(false)}
        center
        classNames={{ modal: 'w-full max-w-md rounded-3xl bg-card p-0 text-foreground overflow-hidden' }}
      >
        <div className="border-b border-border bg-card px-6 py-5">
          <h2 className="text-2xl font-bold text-foreground">Delete Campaign</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This will permanently remove the campaign and its admin record.
          </p>
        </div>
        <div className="bg-card px-6 py-6 text-sm text-muted-foreground">
          Delete <span className="font-semibold text-foreground">{deletingCampaign?.title}</span>?
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

type CampaignCreateFormProps = {
  formData: CampaignCreateFormState;
  formError: string;
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onExtraImagesChange: (values: string[]) => void;
  onStatusChange: (value: CampaignStatus) => void;
  onFeaturedChange: (checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

function CampaignCreateForm({
  formData,
  formError,
  loading,
  onInputChange,
  onExtraImagesChange,
  onStatusChange,
  onFeaturedChange,
  onSubmit,
  onCancel,
}: CampaignCreateFormProps) {
  return (
    <form onSubmit={onSubmit} className="bg-card text-foreground">
      <div className="space-y-6 bg-card px-6 py-6 sm:px-8">
        {formError && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {formError}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="create-title" className="text-sm font-semibold text-foreground">
            Title *
          </label>
          <Input
            id="create-title"
            name="title"
            value={formData.title}
            onChange={onInputChange}
            placeholder="Back to School Support Drive"
            disabled={loading}
            className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="create-description" className="text-sm font-semibold text-foreground">
            Description *
          </label>
          <textarea
            id="create-description"
            name="description"
            value={formData.description}
            onChange={onInputChange}
            placeholder="Describe the fundraising campaign and where the support will go."
            disabled={loading}
            rows={4}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-slate-700 shadow-none outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 dark:text-slate-200"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="create-goal" className="text-sm font-semibold text-foreground">
              Goal Amount *
            </label>
            <Input
              id="create-goal"
              name="goal_amount"
              type="number"
              min="1"
              step="0.01"
              value={formData.goal_amount}
              onChange={onInputChange}
              placeholder="250000"
              disabled={loading}
              className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Status</label>
            <FormSelect<CampaignStatus>
              inputId="create-status"
              options={campaignStatusOptions}
              value={formData.status}
              onChange={onStatusChange}
              disabled={loading}
              placeholder="Select status"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="create-start-date" className="text-sm font-semibold text-foreground">
              Start Date *
            </label>
            <Input
              id="create-start-date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={onInputChange}
              disabled={loading}
              className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="create-end-date" className="text-sm font-semibold text-foreground">
              End Date
            </label>
            <Input
              id="create-end-date"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={onInputChange}
              disabled={loading}
              className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
            />
          </div>
        </div>

        <UploadField
          label="Campaign Image"
          value={formData.image_url}
          onValueChange={(value) =>
            onInputChange({ target: { name: 'image_url', value } } as React.ChangeEvent<HTMLInputElement>)
          }
          uploadKind="image"
          accept=".jpg,.jpeg,.png,.gif"
          disabled={loading}
        />

        <MultiImageUploadField
          label="Extra Images"
          values={formData.extra_images}
          onChange={onExtraImagesChange}
          disabled={loading}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="create-seo-title" className="text-sm font-semibold text-foreground">
              SEO Title
            </label>
            <Input
              id="create-seo-title"
              name="seo_title"
              value={formData.seo_title}
              onChange={onInputChange}
              placeholder="SEO title for the campaign page"
              disabled={loading}
              className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="create-seo-description" className="text-sm font-semibold text-foreground">
              SEO Description
            </label>
            <Input
              id="create-seo-description"
              name="seo_description"
              value={formData.seo_description}
              onChange={onInputChange}
              placeholder="SEO description for search previews"
              disabled={loading}
              className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
            />
          </div>
        </div>

        <label className="flex items-start gap-3 rounded-2xl border border-border bg-muted/40 p-4">
          <Checkbox checked={formData.is_featured} onCheckedChange={onFeaturedChange} className="mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Featured campaign</p>
            <p className="text-xs text-muted-foreground">Featured campaigns can be highlighted more prominently.</p>
          </div>
        </label>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border bg-card p-4 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground hover:bg-secondary">
          {loading ? 'Creating...' : 'Create Campaign'}
        </Button>
      </div>
    </form>
  );
}

type CampaignEditFormProps = {
  formData: CampaignEditFormState;
  formError: string;
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onExtraImagesChange: (values: string[]) => void;
  onStatusChange: (value: CampaignStatus) => void;
  onFeaturedChange: (checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

function CampaignEditForm({
  formData,
  formError,
  loading,
  onInputChange,
  onExtraImagesChange,
  onStatusChange,
  onFeaturedChange,
  onSubmit,
  onCancel,
}: CampaignEditFormProps) {
  return (
    <form onSubmit={onSubmit} className="bg-card text-foreground">
      <div className="space-y-6 bg-card px-6 py-6 sm:px-8">
        {formError && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {formError}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="edit-title" className="text-sm font-semibold text-foreground">
            Title *
          </label>
          <Input
            id="edit-title"
            name="title"
            value={formData.title}
            onChange={onInputChange}
            disabled={loading}
            className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-description" className="text-sm font-semibold text-foreground">
            Description *
          </label>
          <textarea
            id="edit-description"
            name="description"
            value={formData.description}
            onChange={onInputChange}
            disabled={loading}
            rows={4}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-slate-700 shadow-none outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 dark:text-slate-200"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="edit-goal" className="text-sm font-semibold text-foreground">
              Goal Amount *
            </label>
            <Input
              id="edit-goal"
              name="goal_amount"
              type="number"
              min="1"
              step="0.01"
              value={formData.goal_amount}
              onChange={onInputChange}
              disabled={loading}
              className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Status</label>
            <FormSelect<CampaignStatus>
              inputId="edit-status"
              options={campaignStatusOptions}
              value={formData.status}
              onChange={onStatusChange}
              disabled={loading}
              placeholder="Select status"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="edit-end-date" className="text-sm font-semibold text-foreground">
              End Date
            </label>
            <Input
              id="edit-end-date"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={onInputChange}
              disabled={loading}
              className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
            />
          </div>

          <UploadField
            label="Campaign Image"
            value={formData.image_url}
            onValueChange={(value) =>
              onInputChange({ target: { name: 'image_url', value } } as React.ChangeEvent<HTMLInputElement>)
            }
            uploadKind="image"
            accept=".jpg,.jpeg,.png,.gif"
            disabled={loading}
          />

          <MultiImageUploadField
            label="Extra Images"
            values={formData.extra_images}
            onChange={onExtraImagesChange}
            disabled={loading}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="edit-seo-title" className="text-sm font-semibold text-foreground">
              SEO Title
            </label>
            <Input
              id="edit-seo-title"
              name="seo_title"
              value={formData.seo_title}
              onChange={onInputChange}
              disabled={loading}
              className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-seo-description" className="text-sm font-semibold text-foreground">
              SEO Description
            </label>
            <Input
              id="edit-seo-description"
              name="seo_description"
              value={formData.seo_description}
              onChange={onInputChange}
              disabled={loading}
              className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
            />
          </div>
        </div>

        <label className="flex items-start gap-3 rounded-2xl border border-border bg-muted/40 p-4">
          <Checkbox checked={formData.is_featured} onCheckedChange={onFeaturedChange} className="mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Featured campaign</p>
            <p className="text-xs text-muted-foreground">Featured campaigns can be highlighted more prominently.</p>
          </div>
        </label>
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
