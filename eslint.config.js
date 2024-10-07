import js from '@eslint/js';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config({ ignores: ['dist'] }, prettierConfig, {
  extends: [js.configs.recommended, ...tseslint.configs.recommended],
  files: ['src/**/*.{ts,tsx}'],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
  },
  plugins: {
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    prettier: prettierPlugin,
    import: importPlugin,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'prettier/prettier': 'error',
    // Add other ESLint rules here
    'no-console': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'prefer-arrow-callback': 'error',
    'func-style': ['error', 'expression'],
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    'react/function-component-definition': 'off',
    'react/jsx-filename-extension': 'off',
    // New rules to enforce single responsibility and pure functions
    'max-lines-per-function': ['error', { max: 100 }],
    complexity: ['error', { max: 5 }],
    'no-param-reassign': 'error',
    // Rule to disallow 'And' in function names
    'id-match': ['error', '^(?!.*And)[a-zA-Z_$][a-zA-Z0-9_$]*$'],
    // Rules to separate and sort imports
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ],
  },
});
