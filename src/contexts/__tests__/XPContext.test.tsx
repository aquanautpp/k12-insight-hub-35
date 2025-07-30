import { renderHook, act } from '@testing-library/react';
import { XPProvider, useXP } from '../XPContext';

describe('XPContext', () => {
  it('adds experience points', () => {
    const { result } = renderHook(() => useXP(), { wrapper: ({ children }) => <XPProvider>{children}</XPProvider> });
    act(() => {
      result.current.addXP(50, 'test');
    });
    expect(result.current.xpData.totalXP).toBe(2900);
  });
});
