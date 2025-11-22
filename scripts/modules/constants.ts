import { resolve } from 'path';

const __dirname = import.meta.dirname;
export const PUBLIC_DIR = resolve(__dirname, '../../public');

export const GENERATED_SCENARIO_PATH = resolve(
  __dirname,
  '../../src/scenario.gen.ts',
);
