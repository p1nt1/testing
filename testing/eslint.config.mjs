import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default [
  {
    ignores: [
      'node_modules/**',
      'test-results/**',
      'playwright-report/**',
      'playwright/.cache/**',
      '*.js',
      '*.mjs',
      'dist/**',
      'build/**'
    ]
  },
  
  eslint.configs.recommended,
  
  ...tseslint.configs.recommended,

  {
    files: ['tests/**/*.ts'],
    ...playwright.configs['flat/recommended']
  },
  
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json'
      },
      globals: {
        node: true,
        es2022: true
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-multi-spaces': 'error',
      'no-trailing-spaces': 'error',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'comma-dangle': ['error', 'never'],
      'indent': ['error', 2, { SwitchCase: 1 }],
      'max-len': ['warn', { 
        code: 120, 
        ignoreComments: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true
      }]
    }
  },
  
  // Playwright-specific rules for test files
  {
    files: ['tests/**/*.spec.ts'],
    rules: {
      'playwright/no-wait-for-timeout': 'warn',
      'playwright/no-element-handle': 'warn',
      'playwright/no-eval': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/no-skipped-test': 'warn',
      'playwright/valid-expect': 'error',
      'playwright/prefer-web-first-assertions': 'warn',
      'playwright/no-useless-await': 'error',
      'playwright/expect-expect': 'off',
      'playwright/no-useless-not': 'off'
    }
  }
];

