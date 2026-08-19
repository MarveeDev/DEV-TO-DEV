import React, { useRef, useState } from 'react';
import Button from './Button';

interface MediaUploaderProps {
  onUploadSuccess: (mediaId: string) => void;
  onError: (error: string) => void;
}

export function MediaUploader({ onUploadSuccess, onError }: MediaUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional frontend validation could be added here

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/v1/media/upload', {
        method: 'POST',
        body: formData,
        // Using relative URL assumes rewrite or proxy is configured,
        // but in this project API usually runs on :3001
        // Let's use the full URL if needed, but the web app probably proxies /api to the backend.
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Upload failed');
      }

      const data = await res.json();
      onUploadSuccess(data.id);
    } catch (err: any) {
      onError(err.message || 'An error occurred during upload');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm"
      />
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleButtonClick}
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Attach Image/Video'}
      </Button>
    </div>
  );
}
