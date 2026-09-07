import { describe, expect, it } from 'vitest';

import { ids } from '@bupa-satsang/test-support/fixtures';

import { commonAmount, fromPaise, normalizeMoney, sumMoney, toPaise } from './money.js';

describe('money arithmetic', () => {
  it('normalizes source money and converts through exact paise', () => {
    expect(normalizeMoney(' 00160.3 ')).toBe('160.30');
    expect(normalizeMoney('0')).toBe('0.00');
    expect(normalizeMoney('0.1')).toBe('0.10');
    expect(normalizeMoney('999999999999.99')).toBe('999999999999.99');
    expect(toPaise('160.30')).toBe(16030n);
    expect(fromPaise(16030n)).toBe('160.30');
  });

  it('sums money without floating-point arithmetic and may exceed the source maximum', () => {
    expect(sumMoney(['0.10', '0.20', '160.00'])).toBe('160.30');
    expect(sumMoney(['999999999999.99', '0.01'])).toBe('1000000000000.00');
  });

  it('returns unallocated common amount after valid meal allocations', () => {
    expect(
      commonAmount('1000.00', [
        { mealId: ids.lunch, amount: '400.00' },
        { mealId: ids.nextLunch, amount: '350.00' }
      ])
    ).toBe('250.00');
    expect(commonAmount('160.00', [])).toBe('160.00');
  });

  it('rejects invalid money grammar and negative paise formatting', () => {
    for (const value of ['', ' ', '-1.00', '+1.00', '1e2', '1,000.00', 'NaN', '1.001']) {
      expect(() => normalizeMoney(value)).toThrow();
    }

    expect(() => normalizeMoney('1000000000000.00')).toThrow();
    expect(() => fromPaise(-1n)).toThrow();
  });

  it('rejects duplicate, nonpositive and oversized allocations', () => {
    expect(() =>
      commonAmount('100.00', [
        { mealId: ids.lunch, amount: '40.00' },
        { mealId: ids.lunch, amount: '10.00' }
      ])
    ).toThrow();

    expect(() => commonAmount('100.00', [{ mealId: ids.lunch, amount: '0.00' }])).toThrow();
    expect(() => commonAmount('100.00', [{ mealId: ids.lunch, amount: '100.01' }])).toThrow();
  });
});
