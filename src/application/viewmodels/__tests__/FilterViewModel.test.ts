import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FilterViewModel } from '../FilterViewModel';
import api from '../../../infrastructure/api/api';
import eventBus from '../../events/eventBus';
import { FilterEvents } from '@domain/events/filter';

// Mock the api service
vi.mock('../../../infrastructure/api/api', () => ({
  default: {
    fetchFilters: vi.fn((lang) => {
      if (lang === 'en') return ['All', 'Category A', 'Category B'];
      if (lang === 'tr') return ['Tümü', 'Kategori A', 'Kategori B'];
      if (lang === 'ar') return ['الكل', 'الفئة أ', 'الفئة ب'];
      return [];
    }),
  },
}));

describe('FilterViewModel', () => {
  let viewModel: FilterViewModel;

  beforeEach(() => {
    vi.useFakeTimers();
    viewModel = new FilterViewModel();
    vi.clearAllMocks();
  });

  it('should initialize with default filters and selected filter', async () => {
    // Manually call onMount as it's not called automatically in tests
    await viewModel.onMount();
    expect(viewModel.getData().filters).toEqual(['All', 'Category A', 'Category B']);
    expect(viewModel.getData().selectedFilter).toBe('All');
  });

  it('should select a filter', async () => {
    viewModel.runAttachedFunction(FilterEvents.Select, { filter: 'Category A' });
    await vi.runAllTimersAsync();
    expect(viewModel.getData().selectedFilter).toBe('Category A');
  });

  it('should dispatch filterChanged event when a filter is selected', async () => {
    const spy = vi.spyOn(eventBus, 'dispatch');
    viewModel.runAttachedFunction(FilterEvents.Select, { filter: 'Category B' });
    await vi.runAllTimersAsync();
    expect(spy).toHaveBeenCalledWith(FilterEvents.Changed, { filter: 'Category B' });
  });

  it('should set error and skip dispatch when fetching filters fails', async () => {
    vi.mocked(api.fetchFilters).mockRejectedValueOnce(new Error('boom'));
    const spy = vi.spyOn(eventBus, 'dispatch');

    viewModel.runAttachedFunction(FilterEvents.Select, { filter: 'Category A' });
    await vi.runAllTimersAsync();

    expect(viewModel.getData().error).toBe('boom');
    expect(viewModel.getData().selectedFilter).toBe('All'); // unchanged
    expect(spy).not.toHaveBeenCalledWith(FilterEvents.Changed, expect.anything());
  });
});
