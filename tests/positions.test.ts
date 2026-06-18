import test from 'node:test';
import assert from 'node:assert/strict';
import { createTestServer } from './helpers';

async function registerAndLogin(baseUrl: string) {
  await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      name: 'João',
      email: 'joao@example.com',
      password: 'password123',
    }),
  });

  const login = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email: 'joao@example.com',
      password: 'password123',
    }),
  });

  const loginJson = await login.json();
  return loginJson.data.token as string;
}

test('positions CRUD', async () => {
  const server = await createTestServer();
  try {
    const token = await registerAndLogin(server.baseUrl);

    const created = await fetch(`${server.baseUrl}/positions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: 'Frontend Developer',
        description: 'React e TypeScript',
        requirements: 'React, TS',
      }),
    });

    assert.equal(created.status, 201);
    const createdJson = await created.json();
    const positionId = createdJson.data.id as string;
    assert.equal(createdJson.data.status, 'applied');

    const list = await fetch(`${server.baseUrl}/positions`, {
      headers: { authorization: `Bearer ${token}` },
    });
    assert.equal(list.status, 200);
    const listJson = await list.json();
    assert.equal(listJson.data.length, 1);

    const statusUpdate = await fetch(`${server.baseUrl}/positions/${positionId}/status`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 'interview' }),
    });
    assert.equal(statusUpdate.status, 200);
    const statusUpdateJson = await statusUpdate.json();
    assert.equal(statusUpdateJson.data.status, 'interview');

    const deleted = await fetch(`${server.baseUrl}/positions/${positionId}`, {
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` },
    });
    assert.equal(deleted.status, 200);
  } finally {
    await server.close();
  }
});
