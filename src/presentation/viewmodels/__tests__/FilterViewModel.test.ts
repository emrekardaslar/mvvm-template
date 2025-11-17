import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FilterViewModel } from '../FilterViewModel';
import eventBus from '../../../services/eventBus';

// Mock the api service
vi.mock('../../../services/api', () => ({
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
    viewModel.runAttachedFunction('selectFilter', { filter: 'Category A' });
    await vi.runAllTimersAsync();
    expect(viewModel.getData().selectedFilter).toBe('Category A');
  });

  it('should dispatch filterChanged event when a filter is selected', async () => {
    const spy = vi.spyOn(eventBus, 'dispatch');
    viewModel.runAttachedFunction('selectFilter', { filter: 'Category B' });
    await vi.runAllTimersAsync();
    expect(spy).toHaveBeenCalledWith('filterChanged', { filter: 'Category B' });
  });

  it('should update filters and selected filter on language change', async () => {
    await viewModel.onMount(); // Initialize with English filters
    expect(viewModel.getData().filters).toEqual(['All', 'Category A', 'Category B']);

    eventBus.dispatch('languageChanged', { lang: 'tr' });
    await vi.runAllTimersAsync(); // Wait for async operations in onLanguageChanged

    expect(viewModel.getData().filters).toEqual(['Tümü', 'Kategori A', 'Kategori B']);
    expect(viewModel.getData().selectedFilter).toBe('Tümü');
  });

  it('should dispatch filterChanged event after language change', async () => {
    const spy = vi.spyOn(eventBus, 'dispatch');
    await viewModel.onMount();
    spy.mockClear(); // Clear initial dispatch from onMount

    eventBus.dispatch('languageChanged', { lang: 'tr' });
    await vi.runAllTimersAsync();

    expect(spy).toHaveBeenCalledWith('filterChanged', { filter: 'Tümü' });
  });
});
