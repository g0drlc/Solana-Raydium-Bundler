module.exports = {
  extends: 'google',
  env: {
    node: true,
    mocha: true
  },
  plugins: [
    'pabigot'
  ],
  rules: {
    'guard-for-in': 'off',
    'prefer-rest-params': 'off',
    'prefer-spread': 'off',
    __temporary: 'off',
    'arrow-parens': ['error', 'as-needed'],
    camelcase: 'off',
    curly: 'error',
    eqeqeq: 'error',
    'max-len': ['error', {code: 120, tabWidth: 2}],
    'no-constant-condition': 'off',
    'no-fallthrough': ['error', {commentPattern: 'FALLTHRU'}],
    'no-implicit-coercion': 'off',
    'no-irregular-whitespace': ['error', {skipComments: true}],
    'no-multi-spaces': ['error', {ignoreEOLComments: true}],
    'operator-linebreak': ['error', 'before'],
    'pabigot/affixed-ids': ['error', {
      allowedSuffixes: [
        '_dCel',
        '_ppt'
      ]
    }],
    quotes: ['error', 'single', {
      avoidEscape: true,
      allowTemplateLiterals: true
    }],
    radix: ['error', 'as-needed'],
    'require-jsdoc': 'off',
    'spaced-comment': ['error', 'always', {line: {markers: ['#']}}],
    'valid-jsdoc': 'off',
    yoda: ['error', 'always', {exceptRange: true}]
  },
  parserOptions: {
    sourceType: 'module'
  }
}
