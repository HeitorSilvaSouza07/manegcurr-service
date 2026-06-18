import test from 'node:test';
import assert from 'node:assert/strict';
import { createTestServer } from './helpers';

test('auth flow', async () => {
  const server = await createTestServer();
  try {
    const register = await fetch(`${server.baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'Maria',
        email: 'maria@example.com',
        password: 'password123',
      }),
    });

    assert.equal(register.status, 201);
    const registerJson = await register.json();
    assert.equal(registerJson.success, true);
    assert.equal(registerJson.data.email, 'maria@example.com');

    const login = await fetch(`${server.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: 'maria@example.com',
        password: 'password123',
      }),
    });

    assert.equal(login.status, 200);
    const loginJson = await login.json();
    assert.equal(loginJson.success, true);
    assert.equal(typeof loginJson.data.token, 'string');

    const me = await fetch(`${server.baseUrl}/users/me`, {
      headers: { authorization: `Bearer ${loginJson.data.token}` },
    });

    assert.equal(me.status, 200);
    const meJson = await me.json();
    assert.equal(meJson.data.email, 'maria@example.com');
  } finally {
    await server.close();
  }
});
