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
  },
}));

describe('ProductViewModel', () => {
  let viewModel: ProductViewModel;

  beforeEach(() => {
    vi.useFakeTimers();
    viewModel = new ProductViewModel();
    viewModel.onMount(); // Mount the view model to register event listeners
    vi.clearAllMocks();
  });

  afterEach(() => {
    viewModel.onUnmount(); // Unsubscribe so previous VMs don't react to later dispatches
  });

  it('should initialize with empty products, isLoading false, currentFilter "All", and currentPage 1', () => {
    const data = viewModel.getData();
    expect(data.products).toEqual([]);
    expect(data.isLoading).toBe(false);
    expect(data.currentFilter).toBe("All");
    expect(data.currentPage).toBe(1);
  });

  it('should fetch products when filter changes', async () => {
    eventBus.dispatch(FilterEvents.Changed, { filter: 'Category A' });
    await vi.runAllTimersAsync();

    expect(api.fetchProducts).toHaveBeenCalledWith('en', 'Category A', 1);
    const data = viewModel.getData();
    expect(data.products).toEqual([{ id: 1, name: 'Product 1', category: 'Category A' }]);
    expect(data.currentFilter).toBe('Category A');
    expect(data.currentLang).toBe('en');
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
});
