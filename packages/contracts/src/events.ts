import * as z from 'zod';

import { boundedTextSchema, idSchema, localDateSchema, nullableBoundedTextSchema, positiveVersionSchema, roleSchema, timeZoneSchema } from './common.js';

const eventDetailsShape = {
  id: idSchema,
  communityId: idSchema,
  name: boundedTextSchema,
  venue: nullableBoundedTextSchema,
  startDate: localDateSchema,
  endDate: localDateSchema,
  timeZone: timeZoneSchema,
  version: positiveVersionSchema
};

const eventDetailsCreateInputShape = {
  communityId: eventDetailsShape.communityId,
  name: eventDetailsShape.name,
  venue: eventDetailsShape.venue,
  startDate: eventDetailsShape.startDate,
  endDate: eventDetailsShape.endDate,
  timeZone: eventDetailsShape.timeZone
};

const eventDetailsUpdateInputShape = {
  communityId: eventDetailsShape.communityId,
  name: eventDetailsShape.name,
  venue: eventDetailsShape.venue,
  startDate: eventDetailsShape.startDate,
  endDate: eventDetailsShape.endDate,
  timeZone: eventDetailsShape.timeZone,
  version: eventDetailsShape.version
};

export const eventDetailsSchema = withDateRange(z.object(eventDetailsShape).strict());

export const eventSummarySchema = withDateRange(
  z
    .object({
      ...eventDetailsShape,
      roles: z.array(roleSchema)
    })
    .strict()
);

export const eventDetailsCreateInputSchema = withDateRange(z.object(eventDetailsCreateInputShape).strict());
export const eventDetailsUpdateInputSchema = withDateRange(z.object(eventDetailsUpdateInputShape).strict());

export type EventDetails = z.infer<typeof eventDetailsSchema>;
export type EventSummary = z.infer<typeof eventSummarySchema>;
export type EventDetailsCreateInput = z.infer<typeof eventDetailsCreateInputSchema>;
export type EventDetailsUpdateInput = z.infer<typeof eventDetailsUpdateInputSchema>;

function withDateRange<T extends z.ZodType<{ startDate: string; endDate: string }>>(schema: T): T {
  return schema.refine((event) => event.startDate <= event.endDate, {
    message: 'Event endDate must be on or after startDate.',
    path: ['endDate']
  }) as T;
}
