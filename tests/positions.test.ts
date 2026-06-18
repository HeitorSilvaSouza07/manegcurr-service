import { api } from './helpers';

async function registerAndLogin() {
  await api.post('/auth/register').send({
    name: 'João',
    email: 'joao@example.com',
    password: 'password123',
  });

  const login = await api.post('/auth/login').send({
    email: 'joao@example.com',
    password: 'password123',
  });

  return login.body.data.token as string;
}

describe('positions CRUD', () => {
  it('creates, lists, updates status and deletes a position', async () => {
    const token = await registerAndLogin();

    const created = await api
      .post('/positions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Frontend Developer',
        description: 'React e TypeScript',
        requirements: 'React, TS',
      });

    expect(created.status).toBe(201);
    expect(created.body.data.status).toBe('applied');

    const positionId = created.body.data.id as string;

    const list = await api.get('/positions').set('Authorization', `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(list.body.data).toHaveLength(1);

    const updated = await api
      .patch(`/positions/${positionId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'interview' });

    expect(updated.status).toBe(200);
    expect(updated.body.data.status).toBe('interview');

    const deleted = await api.delete(`/positions/${positionId}`).set('Authorization', `Bearer ${token}`);
    expect(deleted.status).toBe(200);
  });
});
