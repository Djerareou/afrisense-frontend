import { render } from '@testing-library/react';
import { vi } from 'vitest';
import Turnstile from '../Turnstile';

describe('Turnstile component', () => {
  beforeEach(() => {
    // Provide a fake window.turnstile.render implementation
    // that calls the callback immediately with a fake token.
    // The component loads the external script if missing; we stub the global.
      (window as any).turnstile = {
        render: (_el: HTMLElement, options: any) => {
        // Simulate provider issuing a token shortly after render
        setTimeout(() => {
          options.callback('fake-token-123');
        }, 0);
      }
    };
  });

  afterEach(() => {
    delete (window as any).turnstile;
  });

  it('renders container and calls onVerify when token provided', async () => {
    const onVerify = vi.fn();
    render(<Turnstile siteKey="test" onVerify={onVerify} />);

    // Wait for the microtask that triggers the fake callback
    await new Promise((r) => setTimeout(r, 0));
    expect(onVerify).toHaveBeenCalledWith('fake-token-123');
  });
});
