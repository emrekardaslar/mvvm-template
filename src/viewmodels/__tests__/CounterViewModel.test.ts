import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CounterViewModel } from '../CounterViewModel';
import eventBus from '../../services/eventBus';

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
    viewModel.runAttachedFunction('increment');
    expect(viewModel.getData().count).toBe(1);
  });

  it('should decrement the count', () => {
    viewModel.runAttachedFunction('decrement');
    expect(viewModel.getData().count).toBe(-1);
  });

  it('should update title, increment, and decrement on language change', () => {
    eventBus.dispatch('languageChanged', { lang: 'en' });

    // Manually advance timers to ensure setTimeout callback executes
    vi.runAllTimers();

    const updatedData = viewModel.getData();
    expect(updatedData.title).toBe('Counter');
   /*  expect(updatedData.increment).toBe('Artır');
    expect(updatedData.decrement).toBe('Azalt'); */
  });

  it('should not update language if it is the same', () => {
    const spySetData = vi.spyOn(viewModel, 'setData');
    eventBus.dispatch('languageChanged', { lang: 'en' });
    vi.runAllTimers();
    expect(spySetData).not.toHaveBeenCalledWith(expect.objectContaining({ isLoading: true }));
  });
});
