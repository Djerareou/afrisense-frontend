import { render, screen, fireEvent } from '@testing-library/react';
import PasswordResetRequest from '../src/auth/pages/PasswordResetRequest';
import { authApi } from '../src/api/auth.api';

vi.mock('../src/api/auth.api', () => ({
  import { render, screen, fireEvent } from '@testing-library/react';
  import PasswordResetRequest from '../src/auth/pages/PasswordResetRequest';
  import { authApi } from '../src/api/auth.api';

  vi.mock('../src/api/auth.api', () => ({
    authApi: {
      passwordResetRequest: vi.fn().mockResolvedValue(undefined)
    }
  }));

  describe('PasswordResetRequest', () => {
    it('shows success message after submit', async () => {
      render(<PasswordResetRequest />);
      const emailInput = screen.getByPlaceholderText('votre@email.com');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      // Simulate Turnstile token via global stub
      (global as any).turnstile = { render: (_el: HTMLElement, opts: any) => setTimeout(() => opts.callback('token-1'), 0) };

      const button = screen.getByRole('button', { name: /Envoyer les instructions/i });
      fireEvent.click(button);

      // Wait for next tick
      await new Promise((r) => setTimeout(r, 0));

      expect(authApi.passwordResetRequest).toHaveBeenCalled();
      expect(screen.getByText(/vous recevrez un message/i)).toBeInTheDocument();
    });
  });
