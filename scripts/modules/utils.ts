import { stat } from 'node:fs/promises';

export function isFileExists(filePath: string) {
  return stat(filePath)
    .then(() => true)
    .catch(() => false);
}
