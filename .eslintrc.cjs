/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
    root: true,
    extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/eslint-config-prettier/skip-formatting'],
    globals: {
        $: 'writable',
        Buffer: 'writable',
        process: 'writable',
        require: 'writable',
        __dirname: 'writable'
    },
    parserOptions: {
        ecmaVersion: 'latest'
    },
    rules: {
        indent: ['error', 4],
        'max-len': [
            'error',
            {
                code: 200
            }
        ],
        'no-empty': 'off',
        'vue/no-dupe-keys': 'off',
        'no-constant-condition': 'off',
        'no-async-promise-executor': 'off',
        'vue/no-mutating-props': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/no-reserved-component-names': 'off'
    }
}
