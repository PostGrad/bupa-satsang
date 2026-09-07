export type Quantity = string;

const QUANTITY_PATTERN = /^(\d+)(?:\.(\d{1,3}))?$/;
const SOURCE_MAX_MILLIS = 99_999_999_999_999n;

export function quantityMillis(value: Quantity): bigint {
  const trimmed = value.trim();
  const match = QUANTITY_PATTERN.exec(trimmed);
  if (match === null) {
    throw new Error('Quantity must use digits with up to three decimal places.');
  }

  const whole = trimLeadingZeros(match[1]!);
  const fraction = (match[2] ?? '').padEnd(3, '0');
  const millis = BigInt(`${whole}${fraction}`);

  if (millis > SOURCE_MAX_MILLIS) {
    throw new RangeError('Quantity exceeds the source maximum.');
  }

  return millis;
}

function trimLeadingZeros(value: string): string {
  return value.replace(/^0+(?=\d)/, '');
}
