/** @type {import("prettier").Config} */
const config = {
    singleQuote: true,
    proseWrap: 'always',
    trailingComma: 'all',
    plugins: [require.resolve('prettier-plugin-tailwindcss')],
};

module.exports = config;
