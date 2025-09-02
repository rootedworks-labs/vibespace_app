import type { Meta, StoryObj } from '@storybook/react';
import { ReportModal } from './ReportModal';
import { Button } from '@/src/app/components/ui/Button';
import { Flag } from 'lucide-react';

const meta: Meta<typeof ReportModal> = {
  title: 'Components/ReportModal',
  component: ReportModal,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-8 flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    contentType: 'post',
    contentId: 123,
    children: (
      <Button variant="outline">
        <Flag className="h-4 w-4 mr-2" />
        Report Post
      </Button>
    ),
  },
};
