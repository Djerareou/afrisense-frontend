import { render } from '@testing-library/react';
import Turnstile from '../src/components/security/Turnstile';

describe('Turnstile component', () => {
  beforeEach(() => {
    (global as any).turnstile = {
      render: (el: HTMLElement, options: any) => {
        // Immediately call the callback to simulate a token
        setTimeout(() => options.callback('fake-token-123'), 0);
      }
    };
  });

  afterEach(() => {
    delete (global as any).turnstile;
  });

  it('calls onVerify with token', async () => {
    const onVerify = vi.fn();
    render(<Turnstile siteKey="test" onVerify={onVerify} />);
    await new Promise((r) => setTimeout(r, 0));
    expect(onVerify).toHaveBeenCalledWith('fake-token-123');
  });
});
