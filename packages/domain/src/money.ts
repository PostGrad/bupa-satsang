export type Money = string;
export type Id = string;

export interface MealAllocation {
  mealId: Id;
  amount: Money;
}

const MONEY_PATTERN = /^(\d+)(?:\.(\d{1,2}))?$/;
const SOURCE_MAX_PAISE = 99_999_999_999_999n;

export function normalizeMoney(input: string): Money {
  return formatPaise(parseMoney(input, { sourceBounded: true }));
}

export function toPaise(value: Money): bigint {
  return parseMoney(value, { sourceBounded: false });
}

export function fromPaise(value: bigint): Money {
  if (value < 0n) {
    throw new RangeError('Money cannot be negative.');
  }

  return formatPaise(value);
}

export function sumMoney(values: readonly Money[]): Money {
  let total = 0n;
  for (const value of values) {
    total += toPaise(value);
  }

  return fromPaise(total);
}

export function commonAmount(amount: Money, allocations: readonly MealAllocation[]): Money {
  const source = parseMoney(amount, { sourceBounded: true });
  const mealIds = new Set<Id>();
  let allocated = 0n;

  for (const allocation of allocations) {
    if (mealIds.has(allocation.mealId)) {
      throw new Error('Meal allocations must be unique by mealId.');
    }
    mealIds.add(allocation.mealId);

    const allocationAmount = parseMoney(allocation.amount, { sourceBounded: true });
    if (allocationAmount <= 0n) {
      throw new RangeError('Meal allocation amounts must be positive.');
    }

    allocated += allocationAmount;
    if (allocated > source) {
      throw new RangeError('Meal allocation total cannot exceed source amount.');
    }
  }

  return fromPaise(source - allocated);
}

function parseMoney(input: string, options: { sourceBounded: boolean }): bigint {
  const value = input.trim();
  const match = MONEY_PATTERN.exec(value);
  if (match === null) {
    throw new Error('Money must use digits with up to two decimal places.');
  }

  const whole = trimLeadingZeros(match[1]!);
  const fraction = (match[2] ?? '').padEnd(2, '0');
  const paise = BigInt(`${whole}${fraction}`);

  if (options.sourceBounded && paise > SOURCE_MAX_PAISE) {
    throw new RangeError('Money exceeds the source maximum.');
  }

  return paise;
}

function formatPaise(value: bigint): Money {
  const whole = value / 100n;
  const fraction = value % 100n;
  return `${whole.toString()}.${fraction.toString().padStart(2, '0')}`;
}

function trimLeadingZeros(value: string): string {
  return value.replace(/^0+(?=\d)/, '');
}
