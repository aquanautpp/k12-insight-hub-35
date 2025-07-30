import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProgressProvider, useProgress } from '../ProgressContext';

function TestComponent() {
  const { progress, addCompletedActivity, updateProgress, getInsights } = useProgress();
  return (
    <div>
      <span data-testid="count">{progress.completedActivities}</span>
      <button onClick={() => addCompletedActivity()}>add</button>
      <button onClick={() => updateProgress({ skillsProgress: [] })}>clear</button>
      <button onClick={() => getInsights()} data-testid="insights" />
    </div>
  );
}

describe('ProgressContext', () => {
  it('increments completed activities', async () => {
    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    );
    const user = userEvent.setup();
    expect(screen.getByTestId('count').textContent).toBe('5');
    await user.click(screen.getByText('add'));
    expect(screen.getByTestId('count').textContent).toBe('6');
  });

  it('handles empty skills list in getInsights', async () => {
    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText('clear'));
    expect(() => {
      const insightsButton = screen.getByTestId('insights');
      insightsButton.click();
    }).not.toThrow();
  });
});
