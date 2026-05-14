'use client';

import 'react-responsive-modal/styles.css';

import { useEffect, useMemo, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import { Edit, Loader, Mail } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchContactMessages, updateContactMessage } from '@/store/contactSlice';
import type { ContactMessage } from '@/types';

type ReplyFormState = {
  response: string;
};

const defaultReplyForm: ReplyFormState = {
  response: '',
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
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  } catch {
    return date;
  }
}

function getMessageStatus(message: ContactMessage) {
  if (message.response) {
    return 'Responded';
  }
  return message.is_read ? 'Read' : 'Unread';
}

export default function ContactPage() {
  const dispatch = useAppDispatch();
  const { items: messages, loading, error } = useAppSelector((state) => state.contact);

  const [replyingMessage, setReplyingMessage] = useState<ContactMessage | null>(null);
  const [replyForm, setReplyForm] = useState<ReplyFormState>(defaultReplyForm);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchContactMessages({}));
  }, [dispatch]);

  const summary = useMemo(
    () => ({
      total: messages.length,
      unread: messages.filter((item) => !item.is_read).length,
      replied: messages.filter((item) => Boolean(item.response)).length,
    }),
    [messages]
  );

  const closeReplyModal = (open: boolean) => {
    if (!open) {
      setReplyingMessage(null);
      setReplyForm(defaultReplyForm);
      setFormError('');
    }
  };

  const openReplyModal = (message: ContactMessage) => {
    setReplyingMessage(message);
    setReplyForm({ response: message.response || '' });
    setFormError('');
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyingMessage) {
      return;
    }

    if (!replyForm.response.trim()) {
      setFormError('Reply message is required');
      return;
    }

    setSubmitting(true);
    const result = await dispatch(
      updateContactMessage({
        id: replyingMessage.id,
        data: { response: replyForm.response.trim() },
      })
    );
    setSubmitting(false);

    if (updateContactMessage.fulfilled.match(result)) {
      closeReplyModal(false);
    } else {
      setFormError((result.payload as string) || 'Failed to save reply');
    }
  };

  const handleReadToggle = async (message: ContactMessage) => {
    await dispatch(
      updateContactMessage({
        id: message.id,
        data: { is_read: !message.is_read },
      })
    );
  };

  if (loading && messages.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Contact Messages</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review contact form submissions, mark messages as read, and save admin replies.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total messages</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{summary.total}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Unread</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{summary.unread}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Replied</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{summary.replied}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[1180px]">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Sender</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Subject</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Message</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Received</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {messages.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  No contact messages found
                </td>
              </tr>
            ) : (
              messages.map((message) => (
                <tr key={message.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 text-sm text-foreground">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-xl bg-primary/10 p-2 text-primary">
                        <Mail size={16} />
                      </div>
                      <div>
                        <div className="font-semibold">{message.name}</div>
                        <div className="text-xs text-muted-foreground">{message.email}</div>
                        <div className="text-xs text-muted-foreground">
                          {message.phone || 'No phone provided'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    <div className="font-medium">{message.subject}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    <p className="line-clamp-2 max-w-md">{message.message}</p>
                    {message.response && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Reply saved: {message.response}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        message.response
                          ? 'bg-secondary/15 text-secondary'
                          : message.is_read
                            ? 'bg-muted text-foreground'
                            : 'bg-accent/15 text-accent'
                      }`}
                    >
                      {getMessageStatus(message)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{formatDate(message.createdAt)}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleReadToggle(message)}
                        className="rounded-lg border-border bg-muted text-foreground hover:bg-accent/20"
                      >
                        {message.is_read ? 'Mark Unread' : 'Mark Read'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openReplyModal(message)}
                        className="rounded-lg border-border bg-muted text-foreground hover:bg-accent/20"
                      >
                        <Edit size={16} />
                        {message.response ? 'Edit Reply' : 'Reply'}
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
        open={Boolean(replyingMessage)}
        onClose={() => closeReplyModal(false)}
        center
        classNames={{ modal: 'w-full max-w-2xl rounded-[1.75rem] p-0 shadow-2xl' }}
      >
        <div className="bg-card text-foreground">
          <div className="border-b border-border px-8 py-6">
            <h2 className="text-2xl font-bold text-foreground">
              {replyingMessage?.response ? 'Edit Reply' : 'Reply to Message'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Save an internal admin response for this contact submission.
            </p>
          </div>

          <form onSubmit={handleReplySubmit} className="space-y-6 px-8 py-6">
            {formError && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                {formError}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Sender</label>
                <Input value={replyingMessage?.name || ''} readOnly />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Email</label>
                <Input value={replyingMessage?.email || ''} readOnly />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Original Message</label>
              <div className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground">
                {replyingMessage?.message}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Reply *</label>
              <textarea
                value={replyForm.response}
                onChange={(e) => setReplyForm({ response: e.target.value })}
                rows={6}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/20"
                placeholder="Write your reply or admin note..."
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-border pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => closeReplyModal(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-primary text-primary-foreground hover:bg-secondary"
              >
                {submitting ? 'Saving...' : 'Save Reply'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
