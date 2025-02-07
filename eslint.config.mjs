import { config as smartiveConfig } from '@smartive/eslint-config';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...smartiveConfig('nextjs'),
  {
    rules: {
      'react/forbid-component-props': [
        'error',
        {
          forbid: [
            {
              propName: 'className',
              allowedFor: ['NextLink', 'ROverlay', 'RMap', 'RControl.RCustom'],
              message: 'Avoid using className',
            },
          ],
        },
      ],
    },
  },
  {
    ignores: ['test/check-page-errors.js', '**/generated.ts', 'tailwind.config.ts'],
  },
];

export default config;
