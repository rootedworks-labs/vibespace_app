'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/src/app/components/ui/Modal';
import { Button } from '@/src/app/components/ui/Button';
import { useState } from 'react';

interface ConfirmationModalProps {
  triggerButton: React.ReactNode;
  title: string;
  description: string;
  confirmText: string;
  onConfirm: () => void;
  variant?: 'default' | 'destructive';
}

export function ConfirmationModal({
  triggerButton,
  title,
  description,
  confirmText,
  onConfirm,
  variant = 'default',
}: ConfirmationModalProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>{triggerButton}</ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
        </ModalHeader>
        <div className="py-4">
          <p>{description}</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant={variant} onClick={handleConfirm}>
            {confirmText}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}
