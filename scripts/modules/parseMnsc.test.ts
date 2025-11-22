import { describe, expect, test } from 'vitest';
import { convertBBCode } from './parseMnsc';

describe('convertBBCode', () => {
  test('parses BBCode text correctly', () => {
    const bbCodeText = `[t=1.5]こんにちは！
[t=2.0]私は[talk="るたん"]Ruたん[/talk]です。`;

    const result = convertBBCode(bbCodeText);

    expect(result).toEqual({
      lines: [
        { text: 'こんにちは！', duration: 1.5 },
        { text: '私はRuたんです。', duration: 2.0 },
      ],
      talk: 'こんにちは！私はるたんです。',
      duration: 3.5,
    });
  });
});
