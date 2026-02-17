module.exports = {
    root: true,

    env: {
        node: true,
        es2022: true,
    },

    parser: '@typescript-eslint/parser',

    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
        sourceType: 'module,'
    },

    plugins: ['@typescript-eslint', 'import'],

    extends: [
        'eslint:recomended',
        'plugin:@typescript-eslint/recomended',
        'plugin:@typescript-eslint/recomended-requiring-type-checking',
        'pluging:import/recomended',
        'plugin:import/typescript',
        'prettier',
    ],

    settings: {
        'import/resolver': {
            typescript: {
                project: './tsconfig.json',
            },
        },
    },

    rules: {
        '@typescript-eslint/no-unused-vars': ['error'],
        '@typescript-eslint/no-use-before-define': 'error',
        '@typescript-eslint/explicit-function-return-type': 'off',

        'no-unused-vars': 'off',
        'no-use-before-define': 'off',
    },
};
