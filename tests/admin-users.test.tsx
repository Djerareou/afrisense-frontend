import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeAll, afterEach, afterAll, beforeEach, describe, it, expect } from 'vitest';
import AdminUsers from '../src/admin/pages/users';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { API_CONFIG, API_ENDPOINTS } from '../src/api/config';

// In-memory users store for tests
let users = [
  { id: '1', fullName: 'Alice Admin', email: 'alice@example.com', role: 'admin', createdAt: '2025-01-01' },
  { id: '2', fullName: 'Bob Manager', email: 'bob@example.com', role: 'manager', createdAt: '2025-01-02' },
];

const server = setupServer(
  // list users
  rest.get(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.USERS}`, (req, res, ctx) => {
    const page = Number(req.url.searchParams.get('page') || '1');
    const perPage = Number(req.url.searchParams.get('perPage') || '20');
    const q = req.url.searchParams.get('q') || '';
    let items = users.slice();
    if (q) {
      const ql = q.toLowerCase();
      items = items.filter(u => (u.fullName + ' ' + u.email).toLowerCase().includes(ql));
    }
    const start = (page - 1) * perPage;
    const paged = items.slice(start, start + perPage);
    return res(ctx.status(200), ctx.json({ items: paged, total: items.length }));
  }),

  // roles
  rest.get(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH_ROLES}`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(['admin', 'manager', 'viewer']));
  }),

  // create
  rest.post(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.USERS}`, async (req, res, ctx) => {
    const body = await req.json();
    // simple validation
    if (!body.email || !body.password) {
      return res(ctx.status(400), ctx.json({ message: 'Validation error', fields: { email: ['required'], password: ['required'] } }));
    }
    const id = String(Date.now());
    const created = { id, fullName: body.fullName, email: body.email, role: body.role || 'viewer', createdAt: new Date().toISOString() };
    users.unshift(created);
    return res(ctx.status(201), ctx.json(created));
  }),

  // update
  rest.patch(`${API_CONFIG.BASE_URL}/users/:id`, async (req, res, ctx) => {
    const { id } = req.params as any;
    const body = await req.json();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return res(ctx.status(404), ctx.json({ message: 'Not found' }));
    users[idx] = { ...users[idx], ...body };
    return res(ctx.status(200), ctx.json(users[idx]));
  }),

  // delete
  rest.delete(`${API_CONFIG.BASE_URL}/users/:id`, (req, res, ctx) => {
    const { id } = req.params as any;
    users = users.filter(u => u.id !== id);
    return res(ctx.status(204));
  })
);

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('/admin/users flows', () => {
  beforeEach(() => {
    // reset test data
    users = [
      { id: '1', fullName: 'Alice Admin', email: 'alice@example.com', role: 'admin', createdAt: '2025-01-01' },
      { id: '2', fullName: 'Bob Manager', email: 'bob@example.com', role: 'manager', createdAt: '2025-01-02' },
    ];
  });

  it('lists users and supports pagination/search', async () => {
    render(<AdminUsers />);

    // initial users should appear
    expect(await screen.findByText('Alice Admin')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();

    // search for Bob
    fireEvent.change(screen.getByPlaceholderText('Search name or email'), { target: { value: 'bob' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => expect(screen.queryByText('Alice Admin')).not.toBeInTheDocument());
    expect(screen.getByText('Bob Manager')).toBeInTheDocument();
  });

  it('creates a user via modal and shows it in the list', async () => {
    render(<AdminUsers />);

    // open modal
    fireEvent.click(await screen.findByText('New User'));

    const nameInput = screen.getByPlaceholderText('Full name');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(nameInput, { target: { value: 'Carol New' } });
    fireEvent.change(emailInput, { target: { value: 'carol@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(screen.getByText('Save'));

    // Wait for list refresh
    expect(await screen.findByText('Carol New')).toBeInTheDocument();
  });

  it('edits a user and reflects changes', async () => {
    render(<AdminUsers />);

    // wait for users
    expect(await screen.findByText('Alice Admin')).toBeInTheDocument();

    // click Edit on Alice
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    const nameInput = screen.getByPlaceholderText('Full name');
    fireEvent.change(nameInput, { target: { value: 'Alice Updated' } });

    fireEvent.click(screen.getByText('Save'));

    // refreshed list should show updated name
    expect(await screen.findByText('Alice Updated')).toBeInTheDocument();
  });

  it('deletes a user after confirmation', async () => {
    render(<AdminUsers />);

    expect(await screen.findByText('Bob Manager')).toBeInTheDocument();

  const deleteButtons = screen.getAllByText('Remove');
  fireEvent.click(deleteButtons[1]); // open confirm for Bob

    // confirm dialog shows
    expect(await screen.findByText(/Delete user/)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Delete'));

    // Bob should be removed
    await waitFor(() => expect(screen.queryByText('Bob Manager')).not.toBeInTheDocument());
  });
});
