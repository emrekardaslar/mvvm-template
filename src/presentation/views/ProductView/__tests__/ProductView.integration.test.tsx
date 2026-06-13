import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import { ProductView } from '../en/ProductView';
import { ProductViewModel } from '@application/viewmodels/ProductViewModel';

// Opt into React's act() support for this DOM-rendering test.
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@infrastructure/api/api', () => ({
  default: {
    fetchProducts: vi.fn(async (_lang, filter) => [{ id: 99, name: `for-${filter}`, category: 'X' }]),
    fetchFilters: vi.fn(async () => ['All', 'Electronics', 'Apparel']),
    fetchMoreFilters: vi.fn(async () => ['Books', 'Toys']),
    fetchHpl: vi.fn(async (_lang, filter) => [
      { id: 9001, name: `hpl-for-${filter}`, category: 'X', price: 10, discountPercent: 20, rating: 4.5 },
    ]),
  },
}));

// Bridge mirroring MvvmView: own the VM lifecycle. It does NOT subscribe or pass
// data down — the view's leaf components subscribe to their own slices.
function Harness({ vm }: { vm: ProductViewModel }) {
  React.useEffect(() => {
    vm.onMount();
    return () => vm.onUnmount();
  }, [vm]);
  return <ProductView viewModel={vm} />;
}

describe('ProductView interactivity', () => {
  let container: HTMLDivElement;
  let root: Root;
  let vm: ProductViewModel;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    vm = new ProductViewModel({
      products: [{ id: 1, name: 'Laptop', category: 'Electronics', description: '', price: 1 }],
      filters: ['All', 'Electronics', 'Apparel'],
      currentFilter: 'All',
      currentLang: 'en',
      totalPages: 5,
    });
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('updates products when a filter button is clicked', async () => {
    await act(async () => { root.render(<Harness vm={vm} />); });

    const buttons = Array.from(container.querySelectorAll('.filter-button')) as HTMLButtonElement[];
    const electronics = buttons.find((b) => b.textContent === 'Electronics')!;
    expect(electronics).toBeTruthy();

    await act(async () => { electronics.click(); });

    expect(vm.getData().currentFilter).toBe('Electronics');
    expect(vm.getData().products).toEqual([{ id: 99, name: 'for-Electronics', category: 'X' }]);
  });

  it('updates page when the pager next button is clicked', async () => {
    await act(async () => { root.render(<Harness vm={vm} />); });

    const next = Array.from(container.querySelectorAll('.pager-button')).find(
      (b) => b.textContent?.includes('▶')
    ) as HTMLButtonElement;

    await act(async () => { next.click(); });

    expect(vm.getData().currentPage).toBe(2);
  });

  it('appends filters on "load more" without changing the products reference', async () => {
    await act(async () => { root.render(<Harness vm={vm} />); });

    const productsBefore = vm.getData().products;

    const loadMore = container.querySelector('.filter-load-more') as HTMLButtonElement;
    expect(loadMore).toBeTruthy();

    await act(async () => { loadMore.click(); });

    // New filters appended...
    expect(vm.getData().filters).toEqual(['All', 'Electronics', 'Apparel', 'Books', 'Toys']);
    // ...and the products slice is the SAME reference, so a component selecting
    // products would not re-render.
    expect(vm.getData().products).toBe(productsBefore);

    // The new filter is rendered in the DOM.
    const rendered = Array.from(container.querySelectorAll('.filter-button')).map((b) => b.textContent);
    expect(rendered).toContain('Books');

    // ...and the load-more button is gone once the extra filters are loaded.
    expect(container.querySelector('.filter-load-more')).toBeNull();
  });
});
