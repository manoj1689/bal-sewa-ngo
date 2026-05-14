'use client';

import 'react-responsive-modal/styles.css';

import { useEffect, useMemo, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import { Edit, Gift, Loader, Plus, Trash2 } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  createDonation,
  deleteDonation,
  fetchDonations,
  updateDonation,
} from '@/store/donationsSlice';
import type { Donation } from '@/types';
import { Button } from '@/components/ui/button';
import { FormSelect, type FormSelectOption } from '@/components/ui/form-select';
import { Input } from '@/components/ui/input';

type DonationStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
type DonationCurrency = 'INR' | 'USD' | 'EUR';

const donationCurrencyOptions: FormSelectOption<DonationCurrency>[] = [
  { value: 'INR', label: 'INR' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
];

const donationStatusOptions: FormSelectOption<DonationStatus>[] = [
  { value: 'PENDING', label: 'PENDING' },
  { value: 'COMPLETED', label: 'COMPLETED' },
  { value: 'FAILED', label: 'FAILED' },
  { value: 'CANCELLED', label: 'CANCELLED' },
];

type DonationCreateFormState = {
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  amount: string;
  currency: DonationCurrency;
  payment_method: string;
  transaction_id: string;
  campaign_id: string;
  message: string;
};

type DonationEditFormState = {
  status: DonationStatus;
  receipt_url: string;
  message: string;
};

const createDefaultFormState: DonationCreateFormState = {
  donor_name: '',
  donor_email: '',
  donor_phone: '',
  amount: '',
  currency: 'INR',
  payment_method: '',
  transaction_id: '',
  campaign_id: '',
  message: '',
};

const editDefaultFormState: DonationEditFormState = {
  status: 'PENDING',
  receipt_url: '',
  message: '',
};

function getEditFormState(donation: Donation): DonationEditFormState {
  return {
    status: (donation.status as DonationStatus) || 'PENDING',
    receipt_url: donation.receipt_url || '',
    message: donation.message || '',
  };
}

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency || 'INR'} ${amount}`;
  }
}

function formatDate(date: string) {
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

export default function DonationsPage() {
  const dispatch = useAppDispatch();
  const { items: donations, loading, error } = useAppSelector((state) => state.donations);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  const [deletingDonation, setDeletingDonation] = useState<Donation | null>(null);
  const [createForm, setCreateForm] = useState<DonationCreateFormState>(createDefaultFormState);
  const [editForm, setEditForm] = useState<DonationEditFormState>(editDefaultFormState);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchDonations({}));
  }, [dispatch]);

  const donationSummary = useMemo(() => {
    const totalAmount = donations.reduce((sum, item) => sum + item.amount, 0);
    const completedCount = donations.filter((item) => item.status === 'COMPLETED').length;
    return {
      totalAmount,
      completedCount,
    };
  }, [donations]);

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

  const openEditModal = (donation: Donation) => {
    setEditingDonation(donation);
    setEditForm(getEditFormState(donation));
    setFormError('');
  };

  const closeEditModal = (open: boolean) => {
    if (!open) {
      setEditingDonation(null);
      setEditForm(editDefaultFormState);
      setFormError('');
    }
  };

  const closeDeleteModal = (open: boolean) => {
    if (!open) {
      setDeletingDonation(null);
    }
  };

  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!createForm.donor_name || !createForm.donor_email || !createForm.amount) {
      setFormError('Donor name, donor email, and amount are required');
      return;
    }

    const amount = Number(createForm.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      setFormError('Amount must be greater than zero');
      return;
    }

    setSubmitting(true);

    const result = await dispatch(
      createDonation({
        donor_name: createForm.donor_name,
        donor_email: createForm.donor_email,
        donor_phone: createForm.donor_phone || undefined,
        amount,
        currency: createForm.currency || 'INR',
        payment_method: createForm.payment_method || undefined,
        transaction_id: createForm.transaction_id || undefined,
        campaign_id: createForm.campaign_id || undefined,
        message: createForm.message || undefined,
      })
    );

    setSubmitting(false);

    if (createDonation.fulfilled.match(result)) {
      closeCreateModal(false);
    } else {
      setFormError((result.payload as string) || 'Failed to create donation');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!editingDonation) {
      return;
    }

    setSubmitting(true);

    const result = await dispatch(
      updateDonation({
        id: editingDonation.id,
        data: {
          status: editForm.status,
          receipt_url: editForm.receipt_url || undefined,
          message: editForm.message || undefined,
        },
      })
    );

    setSubmitting(false);

    if (updateDonation.fulfilled.match(result)) {
      closeEditModal(false);
    } else {
      setFormError((result.payload as string) || 'Failed to update donation');
    }
  };

  const handleDelete = async () => {
    if (!deletingDonation) {
      return;
    }

    setDeleteSubmitting(true);
    const result = await dispatch(deleteDonation(deletingDonation.id));
    setDeleteSubmitting(false);

    if (deleteDonation.fulfilled.match(result)) {
      closeDeleteModal(false);
    }
  };

  if (loading && donations.length === 0) {
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
          <h1 className="text-3xl font-bold text-foreground">Donations Management</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Track donor activity, review payment details, and manage donation status.
          </p>
        </div>

        <Button
          type="button"
          onClick={openCreateModal}
          className="h-10 rounded-xl bg-primary px-4 text-primary-foreground hover:bg-secondary"
        >
          <Plus size={18} />
          Add Donation
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total donations</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{donations.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Completed donations</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{donationSummary.completedCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Recorded amount</p>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {formatCurrency(donationSummary.totalAmount, 'INR')}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[920px]">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Donor</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Payment</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {donations.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  No donations found
                </td>
              </tr>
            ) : (
              donations.map((donation) => (
                <tr key={donation.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 text-sm text-foreground">
                    <div className="font-semibold">{donation.donor_name}</div>
                    <div className="text-xs text-muted-foreground">{donation.donor_email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {formatCurrency(donation.amount, donation.currency)}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    <div>{donation.payment_method || '-'}</div>
                    <div className="text-xs text-muted-foreground">{donation.transaction_id || 'No transaction ID'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{formatDate(donation.donation_date)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        donation.status === 'COMPLETED'
                          ? 'bg-secondary/15 text-secondary'
                          : donation.status === 'FAILED' || donation.status === 'CANCELLED'
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-accent/15 text-accent'
                      }`}
                    >
                      {donation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(donation)}
                        className="rounded-lg border-border bg-muted text-foreground hover:bg-accent/20"
                      >
                        <Edit size={16} />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingDonation(donation)}
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
        classNames={{ modal: 'w-full max-w-3xl rounded-3xl bg-card p-0 text-foreground overflow-hidden' }}
      >
        <div className="border-b border-border bg-card px-6 py-5 sm:px-8">
          <h2 className="text-2xl font-bold text-foreground">Create Donation</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Add a new donation record with donor details and transaction information.
          </p>
        </div>
        <DonationCreateForm
          formData={createForm}
          formError={formError}
          loading={submitting}
          onInputChange={handleCreateInputChange}
          onCurrencyChange={(value) => setCreateForm((prev) => ({ ...prev, currency: value || 'INR' }))}
          onSubmit={handleCreate}
          onCancel={() => closeCreateModal(false)}
        />
      </Modal>

      <Modal
        open={!!editingDonation}
        onClose={() => closeEditModal(false)}
        center
        classNames={{ modal: 'w-full max-w-2xl rounded-3xl bg-card p-0 text-foreground overflow-hidden' }}
      >
        <div className="border-b border-border bg-card px-6 py-5 sm:px-8">
          <h2 className="text-2xl font-bold text-foreground">Edit Donation</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Update donation status, receipt link, or donor message.
          </p>
        </div>
        <DonationEditForm
          formData={editForm}
          formError={formError}
          loading={submitting}
          onInputChange={handleEditInputChange}
          onStatusChange={(value) => setEditForm((prev) => ({ ...prev, status: value as DonationStatus }))}
          onSubmit={handleEdit}
          onCancel={() => closeEditModal(false)}
        />
      </Modal>

      <Modal
        open={!!deletingDonation}
        onClose={() => closeDeleteModal(false)}
        center
        classNames={{ modal: 'w-full max-w-md rounded-3xl bg-card p-0 text-foreground overflow-hidden' }}
      >
        <div className="border-b border-border bg-card px-6 py-5">
          <h2 className="text-2xl font-bold text-foreground">Delete Donation</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This will permanently remove the donation record.
          </p>
        </div>
        <div className="bg-card px-6 py-6 text-sm text-muted-foreground">
          Delete donation from <span className="font-semibold text-foreground">{deletingDonation?.donor_name}</span>?
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

type DonationCreateFormProps = {
  formData: DonationCreateFormState;
  formError: string;
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCurrencyChange: (value: DonationCurrency) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

function DonationCreateForm({
  formData,
  formError,
  loading,
  onInputChange,
  onCurrencyChange,
  onSubmit,
  onCancel,
}: DonationCreateFormProps) {
  return (
    <form onSubmit={onSubmit} className="bg-card text-foreground">
      <div className="space-y-6 bg-card px-6 py-6 sm:px-8">
        {formError && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {formError}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="create-donor-name" className="text-sm font-semibold text-foreground">
              Donor Name *
            </label>
            <Input
              id="create-donor-name"
              name="donor_name"
              value={formData.donor_name}
              onChange={onInputChange}
              placeholder="Priya Sharma"
              disabled={loading}
              className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="create-donor-email" className="text-sm font-semibold text-foreground">
              Donor Email *
            </label>
            <Input
              id="create-donor-email"
              type="email"
              name="donor_email"
              value={formData.donor_email}
              onChange={onInputChange}
              placeholder="donor@example.com"
              disabled={loading}
              className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="create-donor-phone" className="text-sm font-semibold text-foreground">
              Donor Phone
            </label>
            <Input
              id="create-donor-phone"
              name="donor_phone"
              value={formData.donor_phone}
              onChange={onInputChange}
              placeholder="+91 9876543210"
              disabled={loading}
              className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="create-amount" className="text-sm font-semibold text-foreground">
              Amount *
            </label>
            <Input
              id="create-amount"
              name="amount"
              type="number"
              min="1"
              step="0.01"
              value={formData.amount}
              onChange={onInputChange}
              placeholder="5000"
              disabled={loading}
              className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Currency</label>
            <FormSelect<DonationCurrency>
              inputId="create-currency"
              options={donationCurrencyOptions}
              value={formData.currency}
              onChange={onCurrencyChange}
              disabled={loading}
              placeholder="Select currency"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="create-payment-method" className="text-sm font-semibold text-foreground">
              Payment Method
            </label>
            <Input
              id="create-payment-method"
              name="payment_method"
              value={formData.payment_method}
              onChange={onInputChange}
              placeholder="UPI, CARD, BANK_TRANSFER"
              disabled={loading}
              className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="create-transaction-id" className="text-sm font-semibold text-foreground">
              Transaction ID
            </label>
            <Input
              id="create-transaction-id"
              name="transaction_id"
              value={formData.transaction_id}
              onChange={onInputChange}
              placeholder="TXN-2026-001"
              disabled={loading}
              className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="create-campaign-id" className="text-sm font-semibold text-foreground">
              Campaign ID
            </label>
            <Input
              id="create-campaign-id"
              name="campaign_id"
              value={formData.campaign_id}
              onChange={onInputChange}
              placeholder="Optional campaign ID"
              disabled={loading}
              className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="create-message" className="text-sm font-semibold text-foreground">
            Message
          </label>
          <Input
            id="create-message"
            name="message"
            value={formData.message}
            onChange={onInputChange}
            placeholder="Optional donor message"
            disabled={loading}
            className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
          />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border bg-card p-4 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground hover:bg-secondary">
          {loading ? 'Creating...' : 'Create Donation'}
        </Button>
      </div>
    </form>
  );
}

type DonationEditFormProps = {
  formData: DonationEditFormState;
  formError: string;
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (value: DonationStatus) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

function DonationEditForm({
  formData,
  formError,
  loading,
  onInputChange,
  onStatusChange,
  onSubmit,
  onCancel,
}: DonationEditFormProps) {
  return (
    <form onSubmit={onSubmit} className="bg-card text-foreground">
      <div className="space-y-6 bg-card px-6 py-6 sm:px-8">
        {formError && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {formError}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Status</label>
          <FormSelect<DonationStatus>
            inputId="edit-donation-status"
            options={donationStatusOptions}
            value={formData.status}
            onChange={onStatusChange}
            disabled={loading}
            placeholder="Select status"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-receipt-url" className="text-sm font-semibold text-foreground">
            Receipt URL
          </label>
          <Input
            id="edit-receipt-url"
            name="receipt_url"
            value={formData.receipt_url}
            onChange={onInputChange}
            placeholder="https://example.com/receipt.pdf"
            disabled={loading}
            className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-message" className="text-sm font-semibold text-foreground">
            Message
          </label>
          <Input
            id="edit-message"
            name="message"
            value={formData.message}
            onChange={onInputChange}
            placeholder="Update donor note or internal message"
            disabled={loading}
            className="h-11 rounded-xl border-border px-4 shadow-none focus-visible:border-ring focus-visible:ring-ring/30"
          />
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
