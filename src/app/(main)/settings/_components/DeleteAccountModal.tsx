'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/src/app/api';
import { Button } from '@/src/app/components/ui/Button';
import { Input } from '@/src/app/components/ui/Input';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/src/app/components/ui/Modal';
import { useAuthStore } from '@/src/app/store/authStore';

export function DeleteAccountModal() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [confirmText, setConfirmText] = useState('');
  const username = useAuthStore(state => state.user?.username) || '';

  const handleDelete = async () => {
    if (confirmText !== username) return;

    try {
      // Your backend expects a DELETE to /users/me
      await api.delete('/users/me');
      logout();
      router.push('/');
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  return (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Delete Account</ModalTitle>
        </ModalHeader>
        <div className="space-y-4 py-4">
          <p>
            This action is irreversible. All your data, posts, and files will be permanently deleted. Please type your username <strong className="font-bold">{username}</strong> to confirm.
          </p>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={confirmText !== username}
          >
            I understand, delete my account
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}