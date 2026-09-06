import { describe, expect, it } from 'vitest';

import { HealthController } from './health.controller.js';

describe('HealthController', () => {
  it('reports that the API is live', () => {
    expect(new HealthController().live()).toEqual({ status: 'ok' });
  });
});
