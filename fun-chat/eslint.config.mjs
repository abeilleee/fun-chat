import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

export default defineConfig([
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
    { files: ['**/*.{js,mjs,cjs,ts}'], languageOptions: { globals: globals.browser } },
    { files: ['**/*.{js,mjs,cjs,ts}'], plugins: { js }, extends: ['js/recommended'] },
    tseslint.configs.recommended,
    tseslint.config(eslint.configs.recommended, tseslint.configs.recommendedTypeChecked, {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    }),
    {
        plugins: {
            '@typescript-eslint': typescriptEslint,
        },

        languageOptions: {
            globals: {
                ...globals.browser,
            },

            parser: tsParser,
            ecmaVersion: 5,
            sourceType: 'script',

            parserOptions: {
                project: './tsconfig.json',
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        linterOptions: {
            noInlineConfig: true,
        },
        rules: {
            'no-plusplus': 'off',
            'no-console': 'off',
            'max-lines-per-function': ['error', { max: 40 }],

            'max-len': [
                'warn',
                {
                    code: 120,
                },
            ],

            indent: [
                'warn',
                4,
                {
                    SwitchCase: 1,
                },
            ],

            'import/prefer-default-export': 'off',

            'no-param-reassign': [
                'error',
                {
                    props: false,
                },
            ],

            '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/explicit-member-accessibility': [
                'error',
                { accessibility: 'explicit', overrides: { constructors: 'off' } },
            ],
            '@typescript-eslint/member-ordering': 'error',
            'class-methods-use-this': 'off', //makes it mandatory to use 'this' inside methods

            '@typescript-eslint/no-unsafe-argument': 'off', // make troubles for routing, change!
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-redundant-type-constituents': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/no-base-to-string': 'off',
        },
    },
    eslintPluginUnicorn.configs.recommended,
    {
        rules: {
            'unicorn/better-regex': 'warn',
            'unicorn/prefer-module': 'off',
            'unicorn/no-array-for-each': 'off',
            'unicorn/prevent-abbreviations': 'off',
            'unicorn/prefer-dom-node-dataset': 'off',
            'unicorn/prefer-query-selector': 'off',
            'unicorn/prefer-dom-node-remove': 'off',
            'unicorn/no-console-spaces': 'off',
            'unicorn/no-null': 'off',
            'unicorn/no-for-loop': 'off',
            'unicorn/prefer-math-min-max': 'off',
            'unicorn/prefer-spread': 'off',
            'unicorn/prefer-global-this': 'off',
            'unicorn/prefer-logical-operator-over-ternary': 'off',
            'unicorn/new-for-builtins': 'off',
        },
    },
]);
