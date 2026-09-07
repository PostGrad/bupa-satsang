import { describe, expect, it } from 'vitest';

import { eventFixture, ids, mealFixture } from '@bupa-satsang/test-support/fixtures';

import { localDateSchema } from './common.js';
import { eventDetailsSchema } from './events.js';
import {
  catalogItemSchema,
  type MealMenuEntry,
  type Requirement,
  mealSchema,
  menuEntrySchema,
  requirementSchema,
  validateMealInEvent,
  validateRequirementMenuEntry
} from './planning.js';

describe('event and planning schemas', () => {
  it('rejects impossible local dates and invalid time zones', () => {
    expect(eventDetailsSchema.safeParse({ ...eventFixture(), startDate: '2026-02-30' }).success).toBe(false);
    expect(eventDetailsSchema.safeParse({ ...eventFixture(), timeZone: 'Mars/Olympus' }).success).toBe(false);
    expect(localDateSchema.safeParse('0000-01-01').success).toBe(false);
    expect(localDateSchema.safeParse('2026-09-11').success).toBe(true);
  });

  it('validates meals without tying identity to date or kind', () => {
    expect(() => validateMealInEvent({ ...mealFixture(), servesOn: '2026-09-14' }, eventFixture())).toThrow();
    expect(mealSchema.safeParse({ ...mealFixture(), plannedHeadcount: null }).success).toBe(true);
    expect(mealSchema.safeParse({ ...mealFixture(), servingTime: '24:00' }).success).toBe(false);
    expect(mealSchema.safeParse({ ...mealFixture(), plannedHeadcount: -1 }).success).toBe(false);
    expect(mealSchema.safeParse({ ...mealFixture(), id: ids.dinner, label: 'Dinner' }).success).toBe(true);
  });

  it('validates catalog and menu entries strictly with versions', () => {
    expect(
      catalogItemSchema.safeParse({
        id: ids.rice,
        communityId: ids.community,
        name: 'Rice',
        aliases: ['chokha'],
        retired: false,
        version: 1
      }).success
    ).toBe(true);
    expect(
      catalogItemSchema.safeParse({
        id: ids.rice,
        communityId: ids.community,
        name: 'Rice',
        aliases: [],
        retired: false
      }).success
    ).toBe(false);
    expect(menuEntrySchema.safeParse({ id: ids.rotliLunch, mealId: ids.lunch, dishId: null, name: 'Rotli', retired: false, version: 1 }).success).toBe(true);
  });

  it('enforces requirement menu-entry association locally', () => {
    const requirement = {
      id: ids.reqLunch,
      eventId: ids.event,
      mealId: ids.lunch,
      mealMenuEntryId: ids.rotliLunch,
      itemId: ids.rice,
      description: 'Rice',
      quantity: '5',
      unit: 'kg',
      version: 1,
      retired: false
    } satisfies Requirement;
    const menuEntry = { id: ids.rotliLunch, mealId: ids.lunch, dishId: null, name: 'Rotli', retired: false, version: 1 } satisfies MealMenuEntry;

    expect(requirementSchema.safeParse(requirement).success).toBe(true);
    expect(() => validateRequirementMenuEntry(requirement, menuEntry)).not.toThrow();
    expect(() => validateRequirementMenuEntry({ ...requirement, mealId: ids.dinner }, menuEntry)).toThrow();
    expect(requirementSchema.safeParse({ ...requirement, mealId: null }).success).toBe(false);
  });

  it('returns schema failures instead of throwing for invalid normalized fields', () => {
    const requirement = {
      id: ids.reqLunch,
      eventId: ids.event,
      mealId: ids.lunch,
      mealMenuEntryId: null,
      itemId: ids.rice,
      description: 'Rice',
      quantity: '-1',
      unit: 'kg',
      version: 1,
      retired: false
    };

    expect(() => requirementSchema.safeParse(requirement)).not.toThrow();
    expect(requirementSchema.safeParse(requirement).success).toBe(false);
  });
});
