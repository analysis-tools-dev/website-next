const js = require('@eslint/js');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const nextPlugin = require('@next/eslint-plugin-next');
const tsParser = require('@typescript-eslint/parser');

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
};

module.exports = [
    {
        ignores: [
            '**/node_modules/**',
            '**/.next/**',
            '**/out/**',
            '**/build/**',
            '**/.cache/**',
        ],
    },
    {
        files: jsTsFiles,
        languageOptions: baseLanguageOptions,
        rules: {
            ...js.configs.recommended.rules,
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