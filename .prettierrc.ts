import { type Config } from 'prettier';

const config: Config = {
  printWidth: 80,
  proseWrap: 'preserve',
  singleQuote: true,
  plugins: ['@prettier/plugin-oxc'],
};

export default config;
