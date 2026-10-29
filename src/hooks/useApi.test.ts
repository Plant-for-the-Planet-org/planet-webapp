import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import apiClient from '../utils/apiRequests/apiClient';
import { useAuthStore } from '../stores';
import { resetAllStores } from '../test-utils';
import { useApi } from './useApi';

vi.mock('next-intl', () => ({ useLocale: () => 'en' }));
vi.mock('./useAuthSession', () => ({
  useAuthSession: () => ({ logoutUser: vi.fn() }),
}));
vi.mock('../utils/apiRequests/apiClient', () => ({ default: vi.fn() }));
vi.mock('../utils/apiRequests/getSessionId', () => ({
  default: async () => 'session-id',
}));
vi.mock('../utils/apiRequests/validateToken', () => ({
  validateToken: () => true,
}));

const STORED_IMPERSONATION_DATA = {
  targetEmail: 'target@example.org',
  supportPin: '1111',
};

const sentHeaders = () => {
  const [firstCall] = vi.mocked(apiClient).mock.calls;
  const [requestOptions] = firstCall;
  return requestOptions.additionalHeaders;
};

const renderUseApi = () => renderHook(() => useApi()).result.current;

describe('useApi impersonation headers', () => {
  beforeEach(() => {
    resetAllStores();
    useAuthStore.setState({ token: 'token' });
    vi.mocked(apiClient).mockResolvedValue({});
    localStorage.setItem(
      'impersonationData',
      JSON.stringify(STORED_IMPERSONATION_DATA)
    );
  });

  // Issue #3031: public requests used to carry the target's email and pin too.
  it('leaves them off a public request while impersonating', async () => {
    await renderUseApi().getApi('/app/currencies');

    expect(sentHeaders()).not.toHaveProperty('X-SWITCH-USER');
    expect(sentHeaders()).not.toHaveProperty('X-USER-SUPPORT-PIN');
  });

  it('adds them to an authenticated request while impersonating', async () => {
    await renderUseApi().getApiAuthenticated('/app/profile');

    expect(sentHeaders()).toMatchObject({
      Authorization: 'Bearer token',
      'X-SWITCH-USER': STORED_IMPERSONATION_DATA.targetEmail,
      'X-USER-SUPPORT-PIN': STORED_IMPERSONATION_DATA.supportPin,
    });
  });
});
