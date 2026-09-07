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
    files: ['apps/**/*.{ts,tsx}', 'packages/**/*.{ts,tsx}'],
    ignores: ['**/*.test.ts', '**/*.spec.ts', '**/test/**', '**/e2e/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@bupa-satsang/test-support', '@bupa-satsang/test-support/*'],
              message: 'Test-support fixtures are allowed only in test files and test directories.'
            }
          ]
        }
      ]
    }
  },
  {
    files: ['packages/{contracts,domain,local-store,sync,ui}/src/**/*.{ts,tsx}'],
    ignores: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@nestjs/*', '@bupa-satsang/test-support', '@bupa-satsang/test-support/*'],
              message: 'Public packages must not import NestJS or test fixture modules.'
            },
            {
              group: ['apps/api/*', 'apps/api/**', '**/database', '**/database.*'],
              message: 'Public packages must not import API database modules.'
            }
          ]
        }
      ]
    }
  }
);
