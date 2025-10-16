import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { SunDialSegments } from './SunDialSegments';



const meta: Meta<typeof SunDialSegments> = {
  title: 'Navigation/SunDialSegments',
  component: SunDialSegments,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 520, height: 340, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    
    outerRadius: 140,
    innerRadius: 78,
    spreadDeg: 160,
    centerOffsetY: -6,
  },
};
export default meta;

type Story = StoryObj<typeof SunDialSegments>;

/**
 * A small helper that provides local state inside stories so clicking wedges works.
 */
const StatefulTemplate = (args: React.ComponentProps<typeof SunDialSegments>) => {
  const initial = args.activeKey ?? (args.segments?.[0]?.key ?? 'morning');
  const [active, setActive] = React.useState<string>(initial);

  return (
    <SunDialSegments
      {...args}
      activeKey={active}
      onChange={setActive}
    />
  );
};

export const Default: Story = {
  render: (args) => <StatefulTemplate {...args} />,
  args: {
    activeKey: 'afternoon',
  },
};

export const FullCircleThree: Story = {
  render: (args) => {
    const [active, setActive] = React.useState('afternoon');
    return <SunDialSegments {...args} activeKey={active} onChange={setActive} />;
  },
  args: {
    
    spreadDeg: 360,
    innerRadius: 70,
    outerRadius: 150,
    // centerOffsetY can stay default; not needed for full circle
  },
  parameters: {
    layout: 'centered',
  },
};


export const ThreeSegments: Story = {
  render: (args) => <StatefulTemplate {...args} />,
  args: {
    
    activeKey: 'morning',
    spreadDeg: 160,
    innerRadius: 78,
    outerRadius: 140,
  },
};

export const FiveSegments: Story = {
  render: (args) => <StatefulTemplate {...args} />,
  args: {
    segments: [
      { key: 'dawn',       label: 'Dawn',       color: '#FFE9B5', textColor: '#0E1B2C' },
      { key: 'morning',    label: 'Morning',    color: '#F5E6C9', textColor: '#0E1B2C' },
      { key: 'midday',     label: 'Midday',     color: '#F2B880', textColor: '#111111' },
      { key: 'afternoon',  label: 'Afternoon',  color: '#D36C4E', textColor: '#FFFFFF' },
      { key: 'evening',    label: 'Evening',    color: '#0E1B2C', textColor: '#FFFFFF' },
    ],
    activeKey: 'midday',
    spreadDeg: 180,
    innerRadius: 70,
    outerRadius: 150,
  },
};

export const FullCircle: Story = {
  render: (args) => <StatefulTemplate {...args} />,
  args: {
    segments: [
      { key: 'north', label: 'North', color: '#0E1B2C', textColor: '#FFFFFF' },
      { key: 'ne',    label: 'NE',    color: '#213654', textColor: '#FFFFFF' },
      { key: 'east',  label: 'East',  color: '#365074', textColor: '#FFFFFF' },
      { key: 'se',    label: 'SE',    color: '#4A6A93', textColor: '#FFFFFF' },
      { key: 'south', label: 'South', color: '#5E85B3', textColor: '#FFFFFF' },
      { key: 'sw',    label: 'SW',    color: '#4A6A93', textColor: '#FFFFFF' },
      { key: 'west',  label: 'West',  color: '#365074', textColor: '#FFFFFF' },
      { key: 'nw',    label: 'NW',    color: '#213654', textColor: '#FFFFFF' },
    ],
    activeKey: 'south',
    spreadDeg: 360,
    innerRadius: 70,
    outerRadius: 150,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div style={{ background: '#0b1220', width: 560, height: 380, borderRadius: 12, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};

export const DenseThinRing: Story = {
  render: (args) => <StatefulTemplate {...args} />,
  args: {
    segments: Array.from({ length: 8 }).map((_, i) => ({
      key: `seg-${i}`,
      label: `Seg ${i + 1}`,
      color: i % 2 === 0 ? '#1F3A5F' : '#2C4F7C',
      textColor: '#FFFFFF',
    })),
    activeKey: 'seg-2',
    spreadDeg: 200,
    innerRadius: 116,
    outerRadius: 140,
  },
};

export const WithDarkBackdrop: Story = {
  render: (args) => <StatefulTemplate {...args} />,
  args: {
    activeKey: 'evening',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          background:
            'radial-gradient(120% 120% at 50% 0%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 42%), #0b1220',
          width: 560,
          height: 380,
          borderRadius: 12,
          padding: 16,
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
