import type { Meta, StoryObj } from '@storybook/react';
import { HorizonPath } from './HorizonPath';

const meta: Meta<typeof HorizonPath> = {
  title: 'Prototypes/HorizonPath',
  component: HorizonPath,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HorizonPath>;

export const Default: Story = {};