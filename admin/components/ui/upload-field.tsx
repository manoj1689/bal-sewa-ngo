'use client';

import { useMemo, useState } from 'react';
import { File, Image as ImageIcon, Trash2, Video } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { useAppDispatch } from '@/hooks';
import { uploadDocumentFile, uploadImage, uploadVideo } from '@/store/uploadsSlice';
import type { UploadedAsset } from '@/types';

type UploadKind = 'image' | 'video' | 'document';

type UploadFieldProps = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  onUploaded?: (asset: UploadedAsset) => void;
  onClear?: () => void;
  uploadKind: UploadKind;
  accept: string;
  disabled?: boolean;
};

export function UploadField({
  label,
  value,
  onValueChange,
  onUploaded,
  onClear,
  uploadKind,
  accept,
  disabled = false,
}: UploadFieldProps) {
  const dispatch = useAppDispatch();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadedName, setUploadedName] = useState('');

  const uploadAction = useMemo(() => {
    if (uploadKind === 'document') {
      return uploadDocumentFile;
    }
    if (uploadKind === 'video') {
      return uploadVideo;
    }
    return uploadImage;
  }, [uploadKind]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadError('');
    setUploading(true);
    const result = await dispatch(uploadAction({ file }));
    setUploading(false);
    event.target.value = '';

    if (uploadAction.fulfilled.match(result)) {
      const uploadedAsset = result.payload.data as UploadedAsset;
      if (uploadedAsset?.file_url) {
        onValueChange(uploadedAsset.file_url);
        onUploaded?.(uploadedAsset);
        setUploadedName(uploadedAsset.original_name);
      }
    } else {
      setUploadError((result.payload as string) || 'Failed to upload file');
    }
  };

  const handleClear = () => {
    onValueChange('');
    setUploadedName('');
    setUploadError('');
    onClear?.();
  };

  const resolvedName = uploadedName || (value ? value.split('/').pop() || value : '');
  const resolvedUrl = useMemo(() => {
    if (!value) {
      return '';
    }
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    const backendOrigin = apiBase.replace(/\/api\/v1\/?$/, '');
    return `${backendOrigin}${value.startsWith('/') ? value : `/${value}`}`;
  }, [value]);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      <div className="flex flex-col gap-2">
        <Input type="file" accept={accept} disabled={disabled || uploading} onChange={handleFileChange} className="h-11" />
        <p className="text-xs text-muted-foreground">
          {uploading
            ? 'Uploading file...'
            : 'Upload a file. Storage destination is controlled by the backend environment.'}
        </p>
      </div>

      {value && (
        <div className="rounded-2xl border border-border bg-muted/30 p-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="min-w-0 flex items-center gap-3 text-sm text-foreground">
              {uploadKind === 'image' && <ImageIcon size={16} className="text-primary" />}
              {uploadKind === 'video' && <Video size={16} className="text-primary" />}
              {uploadKind === 'document' && <File size={16} className="text-primary" />}
              <span className="truncate">{resolvedName}</span>
            </div>
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled || uploading}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
              aria-label="Remove uploaded file"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {uploadKind === 'image' ? (
            <img src={resolvedUrl} alt={resolvedName || 'Uploaded preview'} className="max-h-52 w-full rounded-xl object-cover" />
          ) : uploadKind === 'video' ? (
            <video src={resolvedUrl} controls className="max-h-52 w-full rounded-xl bg-black/10" />
          ) : (
            <a
              href={resolvedUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-primary hover:text-secondary"
            >
              Open uploaded file
            </a>
          )}
        </div>
      )}

      {(resolvedName || uploadError) && (
        <div className="text-xs">
          {resolvedName && !uploadError && !value && <p className="text-muted-foreground">Uploaded: {resolvedName}</p>}
          {uploadError && <p className="text-destructive">{uploadError}</p>}
        </div>
      )}
    </div>
  );
}
