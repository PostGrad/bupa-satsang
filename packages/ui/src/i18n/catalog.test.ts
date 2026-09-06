import { describe, expect, it } from 'vitest';

import en from './en.json';
import gu from './gu.json';

describe('shell translations', () => {
  it('keeps the English and Gujarati catalogues aligned', () => {
    expect(Object.keys(gu).sort()).toEqual(Object.keys(en).sort());
    expect(en.appName).toBe('BUPA-Satsang');
    expect(gu.appName).toBe('બુપા સત્સંગ');
  });
});
