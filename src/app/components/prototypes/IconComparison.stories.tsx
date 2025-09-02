import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '@iconify/react';

// Import the selected icon sets
import * as Radix from '@radix-ui/react-icons';
import * as Phosphor from '@phosphor-icons/react';
import * as Hero from '@heroicons/react/24/outline';
import * as Feather from 'react-feather';
import * as Iconoir from 'iconoir-react';
import * as Tabler from '@tabler/icons-react';

// Define wrappers for Iconify for consistency in the table
const MingCuteIcon = (props: { iconName: string, className?: string }) => (
    <Icon icon={props.iconName} className={props.className} />
);

const LucideLabIcon = (props: { iconName: string, className?: string }) => (
    <Icon icon={props.iconName} className={props.className} />
);

const LucideIcon = (props: { iconName: string, className?: string }) => (
    <Icon icon={props.iconName} className={props.className} />
);

const FluentEmojiIcon = (props: { iconName: string, className?: string }) => (
    <Icon icon={props.iconName} className={props.className} />
);

const PhosphorIcon = (props: { iconName: string, className?: string }) => (
    <Icon icon={props.iconName} className={props.className} />
);

const iconSets = {
    Radix: {
        Flow: Radix.GlobeIcon,
        Joy: Radix.FaceIcon,
        Hype: Radix.RocketIcon,
        Warmth: Radix.SunIcon,
        Glow: Radix.StarIcon,
        Reflect: Radix.MoonIcon,
        Love: Radix.HeartIcon,
    },
    Phosphor: {
        Flow: (props: any) => <PhosphorIcon iconName="ph:waves-bold" {...props} />,
        Joy: (props: any) => <PhosphorIcon iconName="ph:smiley-bold" {...props} />,
        Hype: (props: any) => <PhosphorIcon iconName="ph:flame-bold" {...props} />,
        Warmth: (props: any) => <PhosphorIcon iconName="ph:sun-bold" {...props} />,
        Glow: (props: any) => <PhosphorIcon iconName="ph:sparkle-bold" {...props} />,
        Reflect: (props: any) => <PhosphorIcon iconName="ph:flower-lotus-bold" {...props} />,
        Love: (props: any) => <PhosphorIcon iconName="ph:heart-straight-bold" {...props} />,
    },
    Heroicons: {
        Flow: Hero.GlobeAltIcon,
        Joy: Hero.FaceSmileIcon,
        Hype: Hero.FireIcon,
        Warmth: Hero.SunIcon,
        Glow: Hero.SparklesIcon,
        Reflect: Hero.MoonIcon,
        Love: Hero.HeartIcon,
    },
    Feather: {
        Flow: Feather.Wind,
        Joy: Feather.Smile,
        Hype: Feather.Zap,
        Warmth: Feather.Sun,
        Glow: Feather.Star,
        Reflect: Feather.Moon,
        Love: Feather.Heart,
    },
    Iconoir: {
        Flow: Iconoir.SeaWaves,
        Joy: Iconoir.EmojiTalkingHappy,
        Hype: Iconoir.FireFlame,
        Warmth: Iconoir.SunLight,
        Glow: Iconoir.MagicWand,
        Reflect: Iconoir.HalfMoon,
        Love: Iconoir.Heart,
    },
    Tabler: {
        Flow: Tabler.IconWaveSine,
        Joy: Tabler.IconMoodHappy,
        Hype: Tabler.IconFlame,
        Warmth: Tabler.IconSun,
        Glow: Tabler.IconSparkles,
        Reflect: Tabler.IconMoon,
        Love: Tabler.IconHeart,
    },
    MingCute: {
        Flow: (props: any) => <MingCuteIcon iconName="mingcute:wave-line" {...props} />,
        Joy: (props: any) => <MingCuteIcon iconName="mingcute:emoji-line" {...props} />,
        Hype: (props: any) => <MingCuteIcon iconName="mingcute:fire-line" {...props} />,
        Warmth: (props: any) => <MingCuteIcon iconName="mingcute:sun-line" {...props} />,
        Glow: (props: any) => <MingCuteIcon iconName="mingcute:sparkles-line" {...props} />,
        Reflect: (props: any) => <MingCuteIcon iconName="mingcute:lotus-line" {...props} />,
        Love: (props: any) => <MingCuteIcon iconName="mingcute:heart-line" {...props} />,
    },
    LucideLab: {
        Flow: (props: any) => <LucideIcon iconName="lucide:waves" {...props} />,
        Joy: (props: any) => <LucideIcon iconName="lucide:smile" {...props} />,
        Hype: (props: any) => <LucideIcon iconName="lucide:flame" {...props} />,
        Warmth: (props: any) => <LucideIcon iconName="lucide:sun" {...props} />,
        Glow: (props: any) => <LucideIcon iconName="lucide:sparkles" {...props} />,
        Reflect: (props: any) => <LucideLabIcon iconName="lucide-lab:flower-lotus" {...props} />,
        Love: (props: any) => <LucideLabIcon iconName="lucide-lab:handshake" {...props} />,
    },
    FluentEmoji: {
        Flow: (props: any) => <FluentEmojiIcon iconName="fluent:water-24-regular" {...props} />,
        Joy: (props: any) => <FluentEmojiIcon iconName="fluent:emoji-laugh-24-regular" {...props} />,
        Hype: (props: any) => <FluentEmojiIcon iconName="fluent-emoji-high-contrast:fire" {...props} />,
        Warmth: (props: any) => <FluentEmojiIcon iconName="fluent:weather-sunny-24-regular" {...props} />,
        Glow: (props: any) => <FluentEmojiIcon iconName="fluent:sparkle-24-regular" {...props} />,
        Reflect: (props: any) => <FluentEmojiIcon iconName="fluent-emoji-high-contrast:lotus" {...props} />,
        Love: (props: any) => <FluentEmojiIcon iconName="fluent:heart-24-regular" {...props} />,
    },
};

const meta: Meta = {
    title: 'Prototypes/Icon Comparison',
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;

export const Default: StoryObj = {
    render: () => (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Vibe Icon Comparison</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vibe</th>
                            {Object.keys(iconSets).map((name) => (
                                <th key={name} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {Object.keys(iconSets.Radix).map((vibe) => (
                            <tr key={vibe}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{vibe}</td>
                                {Object.entries(iconSets).map(([setName, icons]) => {
                                    const IconComponent = icons[vibe as keyof typeof icons];
                                    return (
                                        <td key={`${setName}-${vibe}`} className="px-6 py-4 whitespace-nowrap">
                                            {IconComponent && <IconComponent className="w-6 h-6" />}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    ),
};

