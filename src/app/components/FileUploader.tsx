'use client';

import { useState, useRef } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import api from '@/src/app/api';
import { ConsentModal } from './ConsentModal';
import { Upload } from 'lucide-react';

export function FileUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsConsent, setNeedsConsent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const attemptUpload = async () => {
    if (!selectedFile) return;
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Your backend handles the file upload at POST /api/uploads
      const response = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Upload successful:', response.data);
      // Handle success (e.g., clear file, show success message)
      setSelectedFile(null);
    } catch (err: any) {
      // Your backend returns a 403 with this specific error
      if (err.response?.data?.error === 'Consent required for this action') {
        setNeedsConsent(true);
      } else {
        setError('Upload failed. Please try again.');
        console.error('Upload error:', err);
      }
    }
  };

  // This function is called after the user grants consent in the modal
  const onConsentGranted = () => {
    setNeedsConsent(false);
    attemptUpload(); // Retry the upload automatically
  };

  const uploadButton = (
    <Button onClick={attemptUpload} disabled={!selectedFile}>
      <Upload className="h-4 w-4 mr-2" />
      Upload File
    </Button>
  );

  return (
    <div className="p-4 border rounded-lg max-w-md mx-auto space-y-4">
      <h3 className="font-heading font-bold">Upload a File</h3>
      <Input type="file" onChange={handleFileChange} ref={fileInputRef} />

      {needsConsent ? (
        <ConsentModal
          consentType="file_upload"
          title="Permission to Upload"
          description="To upload files, Vibespace needs your consent to store your content. This helps us manage your data responsibly."
          onConsentGranted={onConsentGranted}
        >
          {uploadButton}
        </ConsentModal>
      ) : (
        uploadButton
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}