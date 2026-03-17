import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../src/app/App';

function makeFetchMock() {
  const users: any[] = [
    { id: '1', fullName: 'Alice Admin', email: 'admin@local', role: 'admin', createdAt: '2024-12-01' },
  ];

  return vi.fn(async (input: any, init?: any) => {
    const url = typeof input === 'string' ? input : input.url;
    const method = (init && init.method) || 'GET';

    // Login
    if (url.includes('/auth/login') && method === 'POST') {
      return {
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: { token: 'tok-123', user: { id: '1', email: 'admin@local', role: 'admin' }, sessionId: 's' } }),
      };
    }

    // Get profile
    if (url.includes('/auth/me') && method === 'GET') {
      return {
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: { id: '1', fullName: 'Alice Admin', email: 'admin@local', role: 'admin' } }),
      };
    }

    // Roles
    if (url.includes('/auth/roles') && method === 'GET') {
      return {
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: ['admin', 'manager', 'viewer'] }),
      };
    }

    // Users list
    if (url.endsWith('/users') && method === 'GET') {
      return {
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: { items: users, total: users.length } }),
      };
    }

    // Register (create user)
    if (url.includes('/auth/register') && method === 'POST') {
      const body = init && init.body ? JSON.parse(init.body) : {};
      const newUser = { id: String(users.length + 1), fullName: body.fullName, email: body.email, role: body.role ?? 'manager', createdAt: new Date().toISOString() };
      users.push(newUser);
      return {
        ok: true,
        status: 201,
        json: async () => ({ success: true, data: newUser }),
      };
    }

    // Default fallback
    return {
      ok: true,
      status: 200,
      json: async () => ({}),
    } as any;
  });
}

describe('Admin flow: login -> /admin -> create user', () => {
  let originalFetch: any;

  beforeEach(() => {
    originalFetch = (global as any).fetch;
    (global as any).fetch = makeFetchMock();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    (global as any).fetch = originalFetch;
  });

  it('allows login, navigation to admin and creating a user', async () => {
    render(<App />);

    // Fill and submit login form
    const email = screen.getByPlaceholderText('votre@email.com');
    const password = screen.getByPlaceholderText('••••••••');
    fireEvent.change(email, { target: { value: 'admin@local' } });
    fireEvent.change(password, { target: { value: 'password' } });

    const submit = screen.getByRole('button', { name: /Se connecter/i });
    fireEvent.click(submit);

    // Wait for header to show the user name (profile fetched)
    await waitFor(() => expect(screen.getByText('Alice Admin')).toBeInTheDocument());

    // Navigate to /admin
    // push history state so the router shows admin routes
    window.history.pushState({}, '', '/admin');

    // Sidebar should render; click Users
    await waitFor(() => expect(screen.getByText('Users')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Users'));

    // Wait for users list to load and show Alice Admin
    await waitFor(() => expect(screen.getByText('Alice Admin')).toBeInTheDocument());

    // Open New User modal
    fireEvent.click(screen.getByText('New User'));

    // Fill modal fields
    const fullNameInput = screen.getByPlaceholderText('Full name');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmInput = screen.getByPlaceholderText('Confirm password');

    fireEvent.change(fullNameInput, { target: { value: 'Bob Manager' } });
    fireEvent.change(emailInput, { target: { value: 'bob@local' } });
    fireEvent.change(passwordInput, { target: { value: 'P@ssw0rd' } });
    fireEvent.change(confirmInput, { target: { value: 'P@ssw0rd' } });

    // Click Create
    fireEvent.click(screen.getByText('Create'));

    // After create, expect new user to appear in list
    await waitFor(() => expect(screen.getByText('Bob Manager')).toBeInTheDocument());
  });
});
