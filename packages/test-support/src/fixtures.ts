import { randomUUID } from 'node:crypto';

type Id = string;
type Money = string;
type Quantity = string;
type Unit = 'g' | 'kg' | 'ml' | 'l' | 'piece' | 'packet' | 'vessel';

interface MealAllocation {
  mealId: Id;
  amount: Money;
}

interface BillLine {
  id: Id;
  itemId: Id | null;
  requirementIds: Id[];
  description: string;
  quantity: Quantity;
  unit: Unit;
  amount: Money;
  category: string;
  allocations: MealAllocation[];
}

interface BillPayload {
  purchaserId: Id;
  purchasedOn: string;
  vendor: string | null;
  reference: string | null;
  lines: BillLine[];
}

interface EventDetails {
  id: Id;
  communityId: Id;
  name: string;
  venue: string | null;
  startDate: string;
  endDate: string;
  timeZone: string;
  version: number;
}

interface Meal {
  id: Id;
  eventId: Id;
  version: number;
  servesOn: string;
  servingTime: string | null;
  kind: string;
  label: string;
  plannedHeadcount: number | null;
  status: 'planned' | 'completed' | 'cancelled';
}

type Base = { kind: 'absent' } | { kind: 'version'; value: number } | { kind: 'mutation'; mutationId: Id };

interface BillMutation {
  schemaVersion: 1;
  mutationId: Id;
  eventId: Id;
  entityId: Id;
  kind: 'bill.create' | 'bill.update';
  base: Base;
  payload: BillPayload;
}

export const ids = {
  community: testId('000000000001'),
  event: testId('000000000010'),
  otherEvent: testId('000000000011'),
  shopperA: testId('000000000020'),
  shopperB: testId('000000000021'),
  chef: testId('000000000022'),
  kitchenHead: testId('000000000023'),
  cashier: testId('000000000024'),
  ravisabhaHead: testId('000000000025'),
  admin: testId('000000000026'),
  lunch: testId('000000000030'),
  dinner: testId('000000000031'),
  nextLunch: testId('000000000032'),
  nextDinner: testId('000000000033'),
  rotliLunch: testId('000000000040'),
  rotliDinner: testId('000000000041'),
  rice: testId('000000000050'),
  tomato: testId('000000000051'),
  reqLunch: testId('000000000060'),
  reqDinner: testId('000000000061')
} as const;

export function bill160(overrides: Partial<BillPayload> = {}): BillPayload {
  return clone({
    purchaserId: ids.shopperA,
    purchasedOn: '2026-09-11',
    vendor: null,
    reference: null,
    lines: [
      {
        id: randomUUID(),
        itemId: ids.tomato,
        requirementIds: [],
        description: 'Tomatoes',
        quantity: '4',
        unit: 'kg',
        amount: '160.00',
        category: 'Vegetables',
        allocations: []
      }
    ],
    ...overrides
  });
}

export function createBill(overrides: Partial<BillMutation> = {}): BillMutation {
  return clone({
    schemaVersion: 1,
    mutationId: randomUUID(),
    eventId: ids.event,
    entityId: randomUUID(),
    kind: 'bill.create',
    base: { kind: 'absent' },
    payload: bill160(),
    ...overrides
  });
}

export function eventFixture(overrides: Partial<EventDetails> = {}): EventDetails {
  return clone({
    id: ids.event,
    communityId: ids.community,
    name: 'Anand two-day test',
    venue: null,
    startDate: '2026-09-12',
    endDate: '2026-09-13',
    timeZone: 'Asia/Kolkata',
    version: 1,
    ...overrides
  });
}

export function mealFixture(overrides: Partial<Meal> = {}): Meal {
  return clone({
    id: ids.lunch,
    eventId: ids.event,
    version: 1,
    servesOn: '2026-09-12',
    servingTime: '12:00',
    kind: 'lunch',
    label: 'Lunch',
    plannedHeadcount: 250,
    status: 'planned',
    ...overrides
  });
}

function testId(suffix: string): Id {
  return `00000000-0000-4000-8000-${suffix}`;
}

function clone<T>(value: T): T {
  return structuredClone(value);
}
