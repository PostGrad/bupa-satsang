import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/android/**',
      '**/dist/**',
      '**/node_modules/**',
      '**/playwright-report/**',
      '**/test-results/**'
    ]
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { "argsIgnorePattern": '^_' }]
    }
  },
  {
    files: ['apps/client/**/*.{ts,tsx}'],
    ignores: ['**/*.test.ts', '**/*.spec.ts', '**/test/**', '**/e2e/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@nestjs/*',
                '@bupa-satsang/test-support',
                '@bupa-satsang/test-support/*',
                '**/test-support',
                '**/test-support/*',
                '**/test-support/**',
                '../api/*',
                '../api/**',
                '../../api/*',
                '../../api/**',
                '../../../api/*',
                '../../../api/**',
                'apps/api/*',
                'apps/api/**',
                '**/apps/api/*',
                '**/apps/api/**'
              ],
              message: 'Client code must not import NestJS, API modules, or test fixtures.'
            },
            {
              group: ['**/database', '**/database.*', '**/database/*', '**/database/**'],
              message: 'Client and public packages must not import database modules.'
            }
          ]
        }
      ]
    }
  },
  {
    files: ['apps/api/**/*.{ts,tsx}'],
    ignores: ['**/*.test.ts', '**/*.spec.ts', '**/test/**', '**/e2e/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@bupa-satsang/test-support',
                '@bupa-satsang/test-support/*',
                '**/test-support',
                '**/test-support/*',
                '**/test-support/**'
              ],
              message: 'Test-support fixtures are allowed only in test files and test directories.'
            }
          ]
        }
      ]
    }
  },
  {
    files: ['packages/{contracts,domain,local-store,sync,ui}/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@nestjs/*'],
              message: 'Public packages must not import NestJS modules.'
            },
            {
              group: [
                'apps/api/*',
                'apps/api/**',
                '**/apps/api/*',
                '**/apps/api/**',
                '**/database',
                '**/database.*',
                '**/database/*',
                '**/database/**'
              ],
              message: 'Public packages must not import API modules or database modules.'
            }
          ]
        }
      ]
    }
  },
  {
    files: ['packages/{contracts,domain,local-store,sync,ui}/src/**/*.{ts,tsx}'],
    ignores: ['**/*.test.ts', '**/*.spec.ts', '**/test/**', '**/e2e/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@nestjs/*',
                '@bupa-satsang/test-support',
                '@bupa-satsang/test-support/*',
                '**/test-support',
                '**/test-support/*',
                '**/test-support/**'
              ],
              message: 'Public packages must not import NestJS or test fixture modules.'
            },
            {
              group: [
                'apps/api/*',
                'apps/api/**',
                '**/apps/api/*',
                '**/apps/api/**',
                '**/database',
                '**/database.*',
                '**/database/*',
                '**/database/**'
              ],
              message: 'Public packages must not import API modules or database modules.'
            }
          ]
        }
      ]
    }
  }
);
