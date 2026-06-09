import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CounterViewModel } from '../CounterViewModel';
import { CounterEvents } from '@domain/events/counter';


describe('CounterViewModel', () => {
  let viewModel: CounterViewModel;

  beforeEach(() => {
    vi.useFakeTimers();
    viewModel = new CounterViewModel();
    vi.clearAllMocks();
  });

  it('should initialize with a count of 0', () => {
    expect(viewModel.getData().count).toBe(0);
  });

  it('should increment the count', () => {
    viewModel.runAttachedFunction(CounterEvents.Increment);
    expect(viewModel.getData().count).toBe(1);
  });

  it('should decrement the count', () => {
    viewModel.runAttachedFunction(CounterEvents.Decrement);
    expect(viewModel.getData().count).toBe(-1);
  });
});
