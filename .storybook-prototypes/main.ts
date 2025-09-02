import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  // Point to your prototype stories
  stories: [
    "../src/app/components/prototypes/**/*.mdx",
    "../src/app/components/prototypes/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
  ],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  staticDirs: ["../public"],
};
export default config;

