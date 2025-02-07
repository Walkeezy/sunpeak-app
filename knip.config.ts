import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['src'],
  ignore: ['src/components/locator.tsx', 'src/components/icons/arrow.tsx'], // TODO: Remove again
  ignoreDependencies: ['tailwindcss'], // Ignore tailwindcss because knip doesn't recognize v4 yet
};

export default config;
