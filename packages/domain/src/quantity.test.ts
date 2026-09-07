import { describe, expect, it } from 'vitest';

import { quantityMillis } from './quantity.js';

describe('quantity arithmetic', () => {
  it('converts decimal quantities to exact milli-units without rounding', () => {
    expect(quantityMillis('1.001')).toBe(1001n);
    expect(quantityMillis('4')).toBe(4000n);
    expect(quantityMillis('0.5')).toBe(500n);
    expect(quantityMillis('0.050')).toBe(50n);
  });

  it('accepts the source quantity maximum and zero for nonnegative quantity uses', () => {
    expect(quantityMillis('99999999999.999')).toBe(99999999999999n);
    expect(quantityMillis('0')).toBe(0n);
  });

  it('rejects invalid quantity grammar without unit conversion', () => {
    for (const value of ['', ' ', '-1', '+1', '1e3', '1,000', 'NaN', '1.0001', '100000000000.000']) {
      expect(() => quantityMillis(value)).toThrow();
    }
  });
});
