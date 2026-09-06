import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const repoRoot = fileURLToPath(new URL('../../..', import.meta.url));
const healthUrl = 'http://127.0.0.1:3000/health/live';

let apiProcess: ChildProcessWithoutNullStreams | undefined;

describe('GET /health/live', () => {
  beforeAll(async () => {
    apiProcess = spawn('pnpm', ['start:api'], {
      cwd: repoRoot,
      env: { ...process.env, NX_DAEMON: 'false', PORT: '3000' }
    });

    await waitForHealth(apiProcess);
  }, 30_000);

  afterAll(() => {
    apiProcess?.kill();
  });

  it('returns the public liveness payload over HTTP', async () => {
    const response = await fetch(healthUrl);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: 'ok' });
  });
});

async function waitForHealth(process: ChildProcessWithoutNullStreams): Promise<void> {
  let output = '';

  process.stdout.on('data', (chunk) => {
    output += chunk.toString();
  });
  process.stderr.on('data', (chunk) => {
    output += chunk.toString();
  });

  const deadline = Date.now() + 25_000;

  while (Date.now() < deadline) {
    const response = await fetch(healthUrl).catch(() => undefined);
    if (response?.ok) {
      return;
    }

    if (process.exitCode !== null) {
      throw new Error(`API process exited before health check passed:\n${output}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Timed out waiting for API health check:\n${output}`);
}
