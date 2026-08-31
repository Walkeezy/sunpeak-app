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
              allowedFor: ['NextLink'],
              message: 'Avoid using className',
            },
          ],
        },
      ],
    },
  },
  {
    ignores: ['**/generated.ts'],
  },
];

export default config;
