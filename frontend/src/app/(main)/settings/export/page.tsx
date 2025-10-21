'use client';

import { useState } from 'react';
import { Button } from '@/src/app/components/ui/Button';
import { exportUserData } from '@/src/app/api'; // We will add this in step 4
import { Download } from 'lucide-react';

export default function ExportDataPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Call the API function which will return a blob
      const blob = await exportUserData();
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(new Blob([blob]));
      
      // Create a temporary link element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      
      // Use the filename from the backend if available, otherwise fallback
      const fileName = `vibespace_data_export_${Date.now()}.json`;
      link.setAttribute('download', fileName);
      
      // Append to the document, click, and remove
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      
    } catch (err) {
      setError('Failed to export your data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-heading font-bold mb-2">Export Your Data</h1>
      <p className="text-neutral-500 mb-8">
        Request a copy of all your VibeSpace data in a machine-readable JSON format.
      </p>

      <div className="p-6 rounded-2xl bg-[var(--color-brand-sand)] dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 max-w-lg">
        <h2 className="text-xl font-heading font-semibold mb-3">Download Your Data Archive</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          Click the button below to start the export process. Your browser will automatically
          download a JSON file containing all of your data, including your profile, posts,
          comments, and connections.
        </p>
        
        <Button onClick={handleExport} disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export My Data
            </>
          )}
        </Button>
        
        {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
      </div>
    </div>
  );
}