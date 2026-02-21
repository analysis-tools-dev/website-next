const js = require('@eslint/js');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const nextPlugin = require('@next/eslint-plugin-next');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const globals = require('globals');

const jsTsFiles = ['**/*.{js,jsx,ts,tsx}'];
const reactFiles = ['**/*.{jsx,tsx}'];

const baseLanguageOptions = {
    parser: tsParser,
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    globals: {
        ...globals.browser,
        ...globals.node,
    },
};

module.exports = [
    {
        ignores: [
            '**/node_modules/**',
            '**/.next/**',
            '**/out/**',
            '**/build/**',
            '**/.cache/**',
            '**/algolia-index.js',
        ],
    },
    {
        files: jsTsFiles,
        languageOptions: baseLanguageOptions,
        plugins: {
            '@typescript-eslint': tsPlugin,
        },
        rules: {
            ...js.configs.recommended.rules,
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-empty-function': 'off',
        },
    },
    {
        files: ['**/*.{ts,tsx}'],
        rules: {
            'no-undef': 'off',
        },
    },
    {
        files: jsTsFiles,
        plugins: {
            '@next/next': nextPlugin,
        },
        rules: {
            ...nextPlugin.configs['core-web-vitals'].rules,
        },
    },
    {
        files: reactFiles,
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            ...reactPlugin.configs.recommended.rules,
            ...reactHooksPlugin.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off',
            'react-hooks/set-state-in-effect': 'off',
        },
    },
];