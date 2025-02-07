import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['src'],
  ignore: ['src/components/locator.tsx', 'src/components/icons/arrow.tsx'], // TODO: Remove again
};

export default config;
