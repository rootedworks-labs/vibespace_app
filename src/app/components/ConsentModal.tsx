'use client';

import { Button } from '@/src/app/components/ui/Button';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/src/app/components/ui/Modal';
import api from '@/src/app/api';

interface ConsentModalProps {
  consentType: string;
  title: string;
  description: string;
  children: React.ReactNode; // The button that triggers the modal
  onConsentGranted: () => void; // A function to call after consent is given
}

export function ConsentModal({
  consentType,
  title,
  description,
  children,
  onConsentGranted,
}: ConsentModalProps) {

  const handleGrantConsent = async () => {
    try {
      // Your backend expects { consent_type }
      await api.post('/consents', { consent_type: consentType });
      onConsentGranted(); // Proceed with the original action
    } catch (error) {
      console.error('Failed to grant consent:', error);
      // Handle error, maybe show a message to the user
    }
  };

  return (
    <Modal>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
        </ModalHeader>
        <div className="py-4">
          <p>{description}</p>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleGrantConsent}>I Agree</Button>
        </div>
      </ModalContent>
    </Modal>
  );
}