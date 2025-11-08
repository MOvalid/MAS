import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            react: reactPlugin,
            prettier: prettierPlugin,
        },
        rules: {
            'prettier/prettier': 'warn',
            'no-unused-vars': 'warn',
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            '@typescript-eslint/no-require-imports': 'off',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
];
