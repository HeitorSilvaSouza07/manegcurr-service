import { api } from './helpers';

describe('auth flow', () => {
  it('registers, logs in and returns /users/me', async () => {
    const register = await api.post('/auth/register').send({
      name: 'Maria',
      email: 'maria@example.com',
      password: 'password123',
    });

    expect(register.status).toBe(201);
    expect(register.body.success).toBe(true);
    expect(register.body.data.email).toBe('maria@example.com');

    const login = await api.post('/auth/login').send({
      email: 'maria@example.com',
      password: 'password123',
    });

    expect(login.status).toBe(200);
    expect(login.body.success).toBe(true);
    expect(typeof login.body.data.token).toBe('string');

    const me = await api.get('/users/me').set('Authorization', `Bearer ${login.body.data.token}`);

    expect(me.status).toBe(200);
    expect(me.body.data.email).toBe('maria@example.com');
  });
});
