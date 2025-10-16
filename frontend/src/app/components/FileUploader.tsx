"use client";

import React, { useRef } from 'react';
import toast from 'react-hot-toast';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  // This more specific type tells TypeScript that the child element can accept an onClick prop.
  children: React.ReactElement<{ onClick?: (event: React.MouseEvent) => void }>; 
}

export function FileUploader({ onFileSelect, children }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        toast.error('Please select an image or video file.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size cannot exceed 10MB.');
        return;
      }
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Clone the child element to add the onClick handler.
  const triggerElement = React.cloneElement(children, {
    onClick: handleClick,
  });

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*"
      />
      {triggerElement}
    </>
  );
}

