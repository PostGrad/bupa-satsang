import * as z from 'zod';

import {
  boundedTextSchema,
  idSchema,
  localDateSchema,
  positiveQuantitySchema,
  positiveVersionSchema,
  safeNonnegativeIntegerSchema,
  servingTimeSchema,
  unitSchema
} from './common.js';
import { eventDetailsSchema } from './events.js';

export const mealStatusSchema = z.enum(['planned', 'completed', 'cancelled']);

const mealShape = {
  id: idSchema,
  eventId: idSchema,
  version: positiveVersionSchema,
  servesOn: localDateSchema,
  servingTime: servingTimeSchema.nullable(),
  kind: boundedTextSchema,
  label: boundedTextSchema,
  plannedHeadcount: safeNonnegativeIntegerSchema.nullable(),
  status: mealStatusSchema
};

const catalogItemShape = {
  id: idSchema,
  communityId: idSchema,
  name: boundedTextSchema,
  aliases: z.array(boundedTextSchema).max(50),
  retired: z.boolean(),
  version: positiveVersionSchema
};

const menuEntryShape = {
  id: idSchema,
  mealId: idSchema,
  dishId: idSchema.nullable(),
  name: boundedTextSchema,
  retired: z.boolean(),
  version: positiveVersionSchema
};

const requirementShape = {
  id: idSchema,
  eventId: idSchema,
  mealId: idSchema.nullable(),
  mealMenuEntryId: idSchema.nullable(),
  itemId: idSchema,
  description: boundedTextSchema,
  quantity: positiveQuantitySchema,
  unit: unitSchema,
  version: positiveVersionSchema,
  retired: z.boolean()
};

export const mealSchema = z.object(mealShape).strict();
export const catalogItemSchema = z.object(catalogItemShape).strict();
export const menuEntrySchema = z.object(menuEntryShape).strict();
export const requirementSchema = withRequirementMenuEntryRule(z.object(requirementShape).strict());

export const shoppingAssignmentSchema = z
  .object({
    requirementId: idSchema,
    shopperId: idSchema
  })
  .strict();

export const purchaseProgressSchema = z
  .object({
    itemId: idSchema.nullable(),
    description: boundedTextSchema,
    unit: unitSchema,
    requirementIds: z.array(idSchema),
    purchasedQuantity: positiveQuantitySchema,
    attribution: z.enum(['complete_group', 'shared_group', 'unplanned'])
  })
  .strict();

export const mealCreateInputSchema = z
  .object({
    eventId: mealShape.eventId,
    servesOn: mealShape.servesOn,
    servingTime: mealShape.servingTime,
    kind: mealShape.kind,
    label: mealShape.label,
    plannedHeadcount: mealShape.plannedHeadcount,
    status: mealShape.status
  })
  .strict();
export const mealUpdateInputSchema = z
  .object({
    eventId: mealShape.eventId,
    version: mealShape.version,
    servesOn: mealShape.servesOn,
    servingTime: mealShape.servingTime,
    kind: mealShape.kind,
    label: mealShape.label,
    plannedHeadcount: mealShape.plannedHeadcount,
    status: mealShape.status
  })
  .strict();
export const catalogItemCreateInputSchema = z
  .object({
    communityId: catalogItemShape.communityId,
    name: catalogItemShape.name,
    aliases: catalogItemShape.aliases
  })
  .strict();
export const catalogItemUpdateInputSchema = z
  .object({
    communityId: catalogItemShape.communityId,
    name: catalogItemShape.name,
    aliases: catalogItemShape.aliases,
    retired: catalogItemShape.retired,
    version: catalogItemShape.version
  })
  .strict();
export const menuEntryCreateInputSchema = z
  .object({
    mealId: menuEntryShape.mealId,
    dishId: menuEntryShape.dishId,
    name: menuEntryShape.name
  })
  .strict();
export const menuEntryUpdateInputSchema = z
  .object({
    mealId: menuEntryShape.mealId,
    dishId: menuEntryShape.dishId,
    name: menuEntryShape.name,
    retired: menuEntryShape.retired,
    version: menuEntryShape.version
  })
  .strict();
export const requirementCreateInputSchema = withRequirementMenuEntryRule(
  z
    .object({
      eventId: requirementShape.eventId,
      mealId: requirementShape.mealId,
      mealMenuEntryId: requirementShape.mealMenuEntryId,
      itemId: requirementShape.itemId,
      description: requirementShape.description,
      quantity: requirementShape.quantity,
      unit: requirementShape.unit
    })
    .strict()
);
export const requirementUpdateInputSchema = withRequirementMenuEntryRule(
  z
    .object({
      eventId: requirementShape.eventId,
      mealId: requirementShape.mealId,
      mealMenuEntryId: requirementShape.mealMenuEntryId,
      itemId: requirementShape.itemId,
      description: requirementShape.description,
      quantity: requirementShape.quantity,
      unit: requirementShape.unit,
      retired: requirementShape.retired,
      version: requirementShape.version
    })
    .strict()
);

function withRequirementMenuEntryRule<T extends z.ZodType<{ mealId: string | null; mealMenuEntryId: string | null }>>(schema: T): T {
  return schema.refine((requirement) => requirement.mealMenuEntryId === null || requirement.mealId !== null, {
    message: 'A requirement with mealMenuEntryId must also reference a mealId.',
    path: ['mealId']
  }) as T;
}

export type Meal = z.infer<typeof mealSchema>;
export type CatalogItem = z.infer<typeof catalogItemSchema>;
export type MealMenuEntry = z.infer<typeof menuEntrySchema>;
export type Requirement = z.infer<typeof requirementSchema>;
export type ShoppingAssignment = z.infer<typeof shoppingAssignmentSchema>;
export type PurchaseProgress = z.infer<typeof purchaseProgressSchema>;
export type MealCreateInput = z.infer<typeof mealCreateInputSchema>;
export type MealUpdateInput = z.infer<typeof mealUpdateInputSchema>;
export type CatalogItemCreateInput = z.infer<typeof catalogItemCreateInputSchema>;
export type CatalogItemUpdateInput = z.infer<typeof catalogItemUpdateInputSchema>;
export type MealMenuEntryCreateInput = z.infer<typeof menuEntryCreateInputSchema>;
export type MealMenuEntryUpdateInput = z.infer<typeof menuEntryUpdateInputSchema>;
export type RequirementCreateInput = z.infer<typeof requirementCreateInputSchema>;
export type RequirementUpdateInput = z.infer<typeof requirementUpdateInputSchema>;

export function validateMealInEvent(meal: Meal, event: z.infer<typeof eventDetailsSchema>): void {
  const parsedMeal = mealSchema.parse(meal);
  const parsedEvent = eventDetailsSchema.parse(event);

  if (parsedMeal.eventId !== parsedEvent.id) {
    throw new Error('Meal must belong to the event.');
  }

  if (parsedMeal.servesOn < parsedEvent.startDate || parsedMeal.servesOn > parsedEvent.endDate) {
    throw new RangeError('Meal servesOn must be inside the event date range.');
  }
}

export function validateRequirementMenuEntry(requirement: Requirement, menuEntry: MealMenuEntry): void {
  const parsedRequirement = requirementSchema.parse(requirement);
  const parsedMenuEntry = menuEntrySchema.parse(menuEntry);

  if (parsedRequirement.mealMenuEntryId === null) {
    return;
  }

  if (parsedRequirement.mealMenuEntryId !== parsedMenuEntry.id) {
    throw new Error('Requirement mealMenuEntryId must reference the provided menu entry.');
  }

  if (parsedRequirement.mealId !== parsedMenuEntry.mealId) {
    throw new Error('Requirement mealId must match the menu entry mealId.');
  }
}
