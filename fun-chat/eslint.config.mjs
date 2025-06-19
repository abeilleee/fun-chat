import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import unicorn from 'eslint-plugin-unicorn';
import tsParser from '@typescript-eslint/parser';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    unicorn.configs.recommended,

    {
        ignores: ['**/dist/**', '**/*config.js', './.stylelintrc.js', './eslint.config.mjs'],
    },
    {
        languageOptions: {
            globals: globals.browser,
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.json',
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
    },

    {
        rules: {
            '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/explicit-member-accessibility': [
                'error',
                { accessibility: 'explicit', overrides: { constructors: 'off' } },
            ],
            '@typescript-eslint/member-ordering': 'error',
            '@typescript-eslint/no-unused-vars': 'error',
            'class-methods-use-this': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-redundant-type-constituents': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/consistent-type-imports': 'off',
            'unicorn/better-regex': 'off',
            'unicorn/filename-case': 'off',
            'unicorn/prefer-module': 0,
            'unicorn/no-array-for-each': 0,
            'unicorn/prevent-abbreviations': 0,
            'unicorn/prefer-dom-node-dataset': 0,
            'unicorn/prefer-query-selector': 0,
            'unicorn/prefer-dom-node-remove': 0,
            'unicorn/no-console-spaces': 0,
            'unicorn/prefer-global-this': 0,
            'unicorn/prefer-node-protocol': 0,
            'unicorn/no-negated-condition': 0,
            'unicorn/no-null': 0,
            'unicorn/no-for-loop': 0,
            'unicorn/prefer-math-min-max': 0,
            'unicorn/prefer-spread': 0,
            'unicorn/prefer-logical-operator-over-ternary': 0,
            'unicorn/no-lonely-if': 0,
            'unicorn/prefer-dom-node-append': 0,
            'unicorn/prefer-switch': 0,
            'unicorn/prefer-number-properties': 0,
            'unicorn/prefer-add-event-listener': 0,
            'unicorn/prefer-blob-reading-methods': 0,
            'unicorn/no-nested-ternary': 0,
        },
    }
);
