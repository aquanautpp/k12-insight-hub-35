import { renderHook, act } from '@testing-library/react';
import { ChallengeProvider, useChallenge } from '../ChallengeContext';

describe('ChallengeContext', () => {
  it('completes a challenge', () => {
    const { result } = renderHook(() => useChallenge(), { wrapper: ({ children }) => <ChallengeProvider>{children}</ChallengeProvider> });
    const challengeId = result.current.challenges[0].id;
    act(() => {
      result.current.completeChallenge(challengeId, 'answer');
    });
    expect(result.current.completedChallenges.length).toBe(1);
    expect(result.current.currentChallenge).toBeNull();
    expect(result.current.challenges.find(c => c.id === challengeId)?.isCompleted).toBe(true);
  });
});
