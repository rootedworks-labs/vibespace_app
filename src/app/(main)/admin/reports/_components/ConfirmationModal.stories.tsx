import type { Meta, StoryObj } from '@storybook/react';
import { ConfirmationModal } from './ConfirmationModal';
import { Button } from '@/src/app/components/ui/Button';
import { fn } from 'storybook/test';

const meta: Meta<typeof ConfirmationModal> = {
  title: 'Components/Admin/ConfirmationModal',
  component: ConfirmationModal,
  tags: ['autodocs'],
  args: {
    onConfirm: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    triggerButton: <Button>Open Modal</Button>,
    title: 'Confirm Action',
    description: 'Are you sure you want to perform this action?',
    confirmText: 'Yes, Confirm',
  },
};

export const Destructive: Story = {
  args: {
    ...Default.args,
    triggerButton: <Button variant="destructive">Delete Item</Button>,
    title: 'Delete Item',
    description: 'This action is permanent and cannot be undone. Are you sure you want to delete this item?',
    confirmText: 'Yes, Delete',
    variant: 'destructive',
  },
};
