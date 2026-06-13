import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ProductViewModel } from '../ProductViewModel';
import api from '@infrastructure/api/api';
import eventBus from '../../events/eventBus';
import { FilterEvents } from '@domain/events/filter';
import { PagerEvents } from '@domain/events/pager';


// Mock the api service
vi.mock('@infrastructure/api/api', () => ({
  default: {
    fetchProducts: vi.fn((lang, filter) => {
      if (lang === 'en') {
        if (filter === 'All') return [{ id: 1, name: 'Product 1', category: 'Category A' }];
        if (filter === 'Category A') return [{ id: 1, name: 'Product 1', category: 'Category A' }];
      }
      if (lang === 'tr') {
        if (filter === 'Tümü') return [{ id: 2, name: 'Ürün 2', category: 'Kategori B' }];
        if (filter === 'Kategori B') return [{ id: 2, name: 'Ürün 2', category: 'Kategori B' }];
      }
      return [];
    }),
    fetchFilters: vi.fn((lang) => {
      if (lang === 'en') return ['All', 'Category A', 'Category B'];
      if (lang === 'tr') return ['Tümü', 'Kategori A', 'Kategori B'];
      return [];
    }),
    fetchMoreFilters: vi.fn(async () => []),
    fetchHpl: vi.fn(async () => []),
  },
}));

describe('ProductViewModel', () => {
  let viewModel: ProductViewModel;

  beforeEach(async () => {
    vi.useFakeTimers();
    // Filters come from SSR initialData (as on the real page), not a mount fetch.
    viewModel = new ProductViewModel({
      filters: ['All', 'Category A', 'Category B'],
      currentFilter: 'All',
      currentLang: 'en',
    });
    viewModel.onMount();
    await vi.runAllTimersAsync(); // let the mount-time HPL fetch settle
    vi.clearAllMocks();
  });

  afterEach(() => {
    viewModel.onUnmount(); // Unsubscribe so previous VMs don't react to later dispatches
  });

  it('should initialize with empty products, isLoading false, no filter, and currentPage 1', () => {
    const freshViewModel = new ProductViewModel();
    const data = freshViewModel.getData();
    expect(data.products).toEqual([]);
    expect(data.filters).toEqual([]);
    expect(data.isLoading).toBe(false);
    expect(data.currentFilter).toBe(null);
    expect(data.currentPage).toBe(1);
    freshViewModel.onUnmount(); // dispose: the constructor subscribed to the bus
  });

  it('uses the SSR-provided filters with the first as the selected filter', () => {
    // Filters are seeded from initialData (SSR), not fetched on mount.
    expect(viewModel.getData().filters).toEqual(['All', 'Category A', 'Category B']);
    expect(viewModel.getData().currentFilter).toBe('All');
  });

  it('should fetch products at page 1 when filter changes', async () => {
    eventBus.dispatch(PagerEvents.Changed, { page: 3 });
    await vi.runAllTimersAsync();
    expect(viewModel.getData().currentPage).toBe(3);

    eventBus.dispatch(FilterEvents.Changed, { filter: 'Category A' });
    await vi.runAllTimersAsync();

    expect(api.fetchProducts).toHaveBeenCalledWith('en', 'Category A', 1);
    const data = viewModel.getData();
    expect(data.products).toEqual([{ id: 1, name: 'Product 1', category: 'Category A' }]);
    expect(data.currentFilter).toBe('Category A');
    expect(data.currentPage).toBe(1);
  });

  it('should set isLoading to true while fetching products', async () => {
    vi.mocked(api.fetchProducts).mockImplementationOnce(() => {
      return new Promise(resolve => setTimeout(() => resolve([]), 100));
    });

    eventBus.dispatch(FilterEvents.Changed, { filter: 'Category A' });

    expect(viewModel.getData().isLoading).toBe(true);

    await vi.runAllTimersAsync(); // Ensure the setTimeout resolves
    expect(viewModel.getData().isLoading).toBe(false);
  });

  it('should fetch products when page changes', async () => {
    eventBus.dispatch(PagerEvents.Changed, { page: 2 });
    await vi.runAllTimersAsync();

    expect(api.fetchProducts).toHaveBeenCalledWith('en', 'All', 2);
    expect(viewModel.getData().currentPage).toBe(2);
  });

  it('should dispatch filterChanged and refetch when a filter is selected from the view', async () => {
    const spy = vi.spyOn(eventBus, 'dispatch');

    viewModel.dispatchEvent(FilterEvents.Select, { filter: 'Category A' });
    await vi.runAllTimersAsync();

    expect(spy).toHaveBeenCalledWith(FilterEvents.Changed, { filter: 'Category A' });
    expect(api.fetchProducts).toHaveBeenCalledWith('en', 'Category A', 1);
    expect(viewModel.getData().currentFilter).toBe('Category A');
  });

  it('should dispatch pageChanged and refetch when the page is changed from the view', async () => {
    const spy = vi.spyOn(eventBus, 'dispatch');

    viewModel.dispatchEvent(PagerEvents.Change, { page: 2 });
    await vi.runAllTimersAsync();

    expect(spy).toHaveBeenCalledWith(PagerEvents.Changed, { page: 2 });
    expect(api.fetchProducts).toHaveBeenCalledWith('en', 'All', 2);
    expect(viewModel.getData().currentPage).toBe(2);
  });

  it('should set error and stop loading when the fetch fails', async () => {
    vi.mocked(api.fetchProducts).mockRejectedValueOnce(new Error('network down'));

    eventBus.dispatch(FilterEvents.Changed, { filter: 'Category A' });
    await vi.runAllTimersAsync();

    const data = viewModel.getData();
    expect(data.error).toBe('network down');
    expect(data.isLoading).toBe(false);
  });

  it('should clear the error when a new fetch starts', async () => {
    vi.mocked(api.fetchProducts).mockRejectedValueOnce(new Error('network down'));
    eventBus.dispatch(FilterEvents.Changed, { filter: 'Category A' });
    await vi.runAllTimersAsync();
    expect(viewModel.getData().error).toBe('network down');

    eventBus.dispatch(FilterEvents.Changed, { filter: 'All' });
    await vi.runAllTimersAsync();
    expect(viewModel.getData().error).toBe(null);
  });

  it('should ignore a stale response when a newer fetch has started', async () => {
    const stale = [{ id: 1, name: 'Stale', category: 'A' }];
    const fresh = [{ id: 2, name: 'Fresh', category: 'B' }];
    let resolveFirst!: (products: typeof stale) => void;
    vi.mocked(api.fetchProducts)
      .mockImplementationOnce(() => new Promise((resolve) => { resolveFirst = resolve; }) as any)
      .mockImplementationOnce(() => Promise.resolve(fresh) as any);

    eventBus.dispatch(FilterEvents.Changed, { filter: 'Category A' }); // slow request
    eventBus.dispatch(FilterEvents.Changed, { filter: 'Category B' }); // fast request
    await vi.runAllTimersAsync();
    expect(viewModel.getData().products).toEqual(fresh);

    resolveFirst(stale); // slow request finishes last
    await vi.runAllTimersAsync();

    expect(viewModel.getData().products).toEqual(fresh);
    expect(viewModel.getData().isLoading).toBe(false);
  });

  it('should set error when fetchFilters() fails', async () => {
    vi.mocked(api.fetchFilters).mockRejectedValueOnce(new Error('boom'));
    const freshViewModel = new ProductViewModel();

    // fetchFilters is no longer auto-called on mount; invoke it directly.
    await freshViewModel.fetchFilters();
    await vi.runAllTimersAsync();

    expect(freshViewModel.getData().error).toBe('boom');
    expect(freshViewModel.getData().filters).toEqual([]);
    freshViewModel.onUnmount();
  });
});
