/** @type {import('eslint').Linter.Config} */

module.exports = {
  extends: ['next', '@smartive/eslint-config/react'],
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
  overrides: [
    {
      files: ['./test/**/*.test.ts'],
      rules: {
        '@typescript-eslint/no-floating-promises': 'off',
      },
    },
  ],
};
