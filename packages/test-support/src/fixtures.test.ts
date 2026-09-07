import { describe, expect, it } from 'vitest';

import { bill160, createBill, eventFixture, ids, mealFixture } from './fixtures.js';

describe('fixture builders', () => {
  it('exports the deterministic F1 ids', () => {
    expect(ids.community).toBe('00000000-0000-4000-8000-000000000001');
    expect(ids.event).toBe('00000000-0000-4000-8000-000000000010');
    expect(ids.tomato).toBe('00000000-0000-4000-8000-000000000051');
    expect(ids.reqDinner).toBe('00000000-0000-4000-8000-000000000061');
  });

  it('creates bills with fresh mutation, entity and line ids', () => {
    const a = createBill();
    const b = createBill();

    expect(a.mutationId).not.toBe(b.mutationId);
    expect(a.entityId).not.toBe(b.entityId);
    expect(a.payload.lines[0]?.id).not.toBe(b.payload.lines[0]?.id);
  });

  it('deep-clones payloads between builds', () => {
    const a = createBill();
    const b = createBill();

    a.payload.lines[0]!.description = 'Changed';

    expect(b.payload.lines[0]?.description).toBe('Tomatoes');
  });

  it('applies bill and mutation overrides without sharing mutable arrays', () => {
    const payload = bill160({
      lines: [
        {
          id: '00000000-0000-4000-8000-999999999001',
          itemId: ids.tomato,
          requirementIds: [ids.reqLunch],
          description: 'Tomatoes',
          quantity: '4',
          unit: 'kg',
          amount: '160.00',
          category: 'Vegetables',
          allocations: [{ mealId: ids.lunch, amount: '100.00' }]
        }
      ]
    });
    const mutation = createBill({ payload });

    payload.lines[0]!.requirementIds.push(ids.reqDinner);
    payload.lines[0]!.allocations[0]!.amount = '1.00';

    expect(mutation.payload.lines[0]?.requirementIds).toEqual([ids.reqLunch]);
    expect(mutation.payload.lines[0]?.allocations).toEqual([{ mealId: ids.lunch, amount: '100.00' }]);
  });

  it('builds F1 event and meal fixtures with independent copies', () => {
    const event = eventFixture();
    const meal = mealFixture();
    const overriddenMeal = mealFixture({ id: ids.dinner, kind: 'dinner', label: 'Dinner', servingTime: '19:00' });

    event.name = 'Changed';

    expect(eventFixture().name).toBe('Anand two-day test');
    expect(meal).toMatchObject({
      id: ids.lunch,
      eventId: ids.event,
      servesOn: '2026-09-12',
      servingTime: '12:00',
      plannedHeadcount: 250
    });
    expect(overriddenMeal).toMatchObject({ id: ids.dinner, kind: 'dinner', label: 'Dinner', servingTime: '19:00' });
  });
});
