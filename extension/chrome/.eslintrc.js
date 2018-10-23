//https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint'
    },
    env: {
        browser: true
    },
    extends: [
        'standard'
    ],
    rules: {
        'indent': ['warn', 4],
        'semi': ['warn', 'always'],
        'spaced-comment': 'off',
        'space-before-function-paren': ['warn', 'never'],
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-unused-vars': 'off',
        'comma-dangle': ['warn', 'never'],
        'no-trailing-spaces': 'warn',
        'no-multiple-empty-lines': 'warn',
        'key-spacing': 'warn',
        'space-infix-ops': 'warn',

        // for this project
        'no-undef': 'off',
        'brace-style': 'off'
    }
};
