import * as z from 'zod';

import { isIanaTimeZone, isLocalDate, isServingTime } from '@bupa-satsang/domain/dates';
import { normalizeMoney } from '@bupa-satsang/domain/money';
import { quantityMillis } from '@bupa-satsang/domain/quantity';

export type Id = string;
export type Money = string;
export type Quantity = string;
export type LocalDate = string;
export type Unit = 'g' | 'kg' | 'ml' | 'l' | 'piece' | 'packet' | 'vessel';
export type Role = 'ravisabha_head' | 'kitchen_head' | 'shopper' | 'chef' | 'cashier';
export type Capability =
  | 'totals.read'
  | 'bill.create'
  | 'bill.read'
  | 'bill.edit'
  | 'expense.read'
  | 'expense.write'
  | 'meal.write'
  | 'requirements.write'
  | 'leftovers.write'
  | 'requirements.readAll';

export interface Principal {
  userId: Id;
}

export interface EventAccess {
  active: boolean;
  roles: Role[];
  accessVersion: number;
}

export interface MealAllocation {
  mealId: Id;
  amount: Money;
}

export const idSchema = z.string().uuid();
export const localDateSchema = z.string().refine(isLocalDate, 'Expected a real YYYY-MM-DD calendar date.');
export const timeZoneSchema = z.string().refine(isIanaTimeZone, 'Expected an IANA time zone.');
export const servingTimeSchema = z.string().refine(isServingTime, 'Expected HH:mm from 00:00 through 23:59.');
export const unitSchema = z.enum(['g', 'kg', 'ml', 'l', 'piece', 'packet', 'vessel']);
export const roleSchema = z.enum(['ravisabha_head', 'kitchen_head', 'shopper', 'chef', 'cashier']);
export const capabilitySchema = z.enum([
  'totals.read',
  'bill.create',
  'bill.read',
  'bill.edit',
  'expense.read',
  'expense.write',
  'meal.write',
  'requirements.write',
  'leftovers.write',
  'requirements.readAll'
]);
export const positiveVersionSchema = z.number().int().min(1).max(Number.MAX_SAFE_INTEGER);
export const safeNonnegativeIntegerSchema = z.number().int().min(0).max(Number.MAX_SAFE_INTEGER);
export const boundedTextSchema = z.string().trim().min(1).max(200);
export const nullableBoundedTextSchema = z
  .string()
  .trim()
  .max(200)
  .transform((value) => (value === '' ? null : value))
  .nullable();
export const moneySchema = z.string().transform((value, ctx) => {
  try {
    return normalizeMoney(value);
  } catch (error) {
    ctx.addIssue({
      code: 'custom',
      message: error instanceof Error ? error.message : 'Invalid money value.'
    });
    return z.NEVER;
  }
});
export const quantitySchema = z.string().transform((value, ctx) => {
  try {
    return formatQuantity(quantityMillis(value));
  } catch (error) {
    ctx.addIssue({
      code: 'custom',
      message: error instanceof Error ? error.message : 'Invalid quantity value.'
    });
    return z.NEVER;
  }
});
export const positiveQuantitySchema = quantitySchema.refine((value) => quantityMillis(value) > 0n, {
  message: 'Quantity must be positive.'
});
export const eventAccessSchema = z
  .object({
    active: z.boolean(),
    roles: z.array(roleSchema),
    accessVersion: positiveVersionSchema
  })
  .strict();
export const principalSchema = z.object({ userId: idSchema }).strict();

function formatQuantity(millis: bigint): Quantity {
  const whole = millis / 1000n;
  const fraction = millis % 1000n;
  if (fraction === 0n) {
    return whole.toString();
  }

  return `${whole.toString()}.${fraction.toString().padStart(3, '0').replace(/0+$/, '')}`;
}
