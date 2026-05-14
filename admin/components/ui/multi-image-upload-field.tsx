'use client';

import { useEffect, useMemo, useState } from 'react';
import { Image as ImageIcon, Trash2 } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { useAppDispatch } from '@/hooks';
import { uploadImage } from '@/store/uploadsSlice';
import type { UploadedAsset } from '@/types';

type MultiImageUploadFieldProps = {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  disabled?: boolean;
};

const EXTRA_IMAGE_NAME_STORAGE_KEY = 'admin-extra-image-names';

function resolveAssetUrl(value: string) {
  if (!value) {
    return '';
  }
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  const backendOrigin = apiBase.replace(/\/api\/v1\/?$/, '');
  return `${backendOrigin}${value.startsWith('/') ? value : `/${value}`}`;
}

export function MultiImageUploadField({
  label,
  values,
  onChange,
  disabled = false,
}: MultiImageUploadFieldProps) {
  const dispatch = useAppDispatch();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [nameMap, setNameMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const saved = window.sessionStorage.getItem(EXTRA_IMAGE_NAME_STORAGE_KEY);
      if (saved) {
        setNameMap(JSON.parse(saved) as Record<string, string>);
      }
    } catch {
      // Ignore bad session storage values and continue with in-memory names.
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.sessionStorage.setItem(EXTRA_IMAGE_NAME_STORAGE_KEY, JSON.stringify(nameMap));
    } catch {
      // Ignore session storage write failures.
    }
  }, [nameMap]);

  const displayNames = useMemo(
    () =>
      values.reduce<Record<string, string>>((acc, value, index) => {
        const savedName = nameMap[value];
        if (savedName) {
          acc[value] = savedName;
          return acc;
        }

        const rawName = value.split('/').pop() || '';
        const decodedName = decodeURIComponent(rawName);
        const looksLikeGeneratedKey =
          /^[a-f0-9]{24,}\.[a-z0-9]+$/i.test(decodedName) ||
          /^[a-z0-9]{20,}$/i.test(decodedName.replace(/\.[a-z0-9]+$/i, ''));

        acc[value] = looksLikeGeneratedKey ? `Extra image ${index + 1}` : decodedName;
        return acc;
      }, {}),
    [nameMap, values]
  );

  const handleFilesChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) {
      return;
    }

    setUploadError('');
    setUploading(true);
    const nextValues = [...values];

    for (const file of files) {
      const result = await dispatch(uploadImage({ file }));
      if (uploadImage.fulfilled.match(result)) {
        const uploadedAsset = result.payload.data as UploadedAsset;
        if (uploadedAsset?.file_url) {
          nextValues.push(uploadedAsset.file_url);
          setNameMap((prev) => ({
            ...prev,
            [uploadedAsset.file_url]: uploadedAsset.original_name || uploadedAsset.file_name,
          }));
        }
      } else {
        setUploadError((result.payload as string) || 'Failed to upload one or more images');
      }
    }

    onChange(nextValues);
    setUploading(false);
    event.target.value = '';
  };

  const removeImage = (index: number) => {
    const valueToRemove = values[index];
    onChange(values.filter((_, imageIndex) => imageIndex !== index));
    setNameMap((prev) => {
      if (!valueToRemove || !prev[valueToRemove]) {
        return prev;
      }
      const next = { ...prev };
      delete next[valueToRemove];
      return next;
    });
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      <Input
        type="file"
        accept=".jpg,.jpeg,.png,.gif"
        multiple
        disabled={disabled || uploading}
        onChange={handleFilesChange}
        className="h-11"
      />
      <p className="text-xs text-muted-foreground">
        {uploading
          ? 'Uploading extra images...'
          : 'Upload one or more extra images. Storage destination is controlled by the backend environment.'}
      </p>

      {values.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {values.map((value, index) => (
            <div key={`${value}-${index}`} className="rounded-2xl border border-border bg-muted/30 p-3">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0 flex items-center gap-2 text-xs text-foreground">
                  <ImageIcon size={14} className="text-primary" />
                  <span className="truncate">{displayNames[value] || `Extra image ${index + 1}`}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  disabled={disabled || uploading}
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                  aria-label={`Remove image ${index + 1}`}
                >
                  <Trash2 size={12} />
                </button>
              </div>

              <img
                src={resolveAssetUrl(value)}
                alt={`Extra image ${index + 1}`}
                className="h-32 w-full rounded-xl object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
    </div>
  );
}
