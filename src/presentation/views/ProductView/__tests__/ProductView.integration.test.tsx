import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import ProductView from '../en/ProductView';
import { ProductViewModel } from '@application/viewmodels/ProductViewModel';

// Opt into React's act() support for this DOM-rendering test.
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@infrastructure/api/api', () => ({
  default: {
    fetchProducts: vi.fn(async (_lang, filter) => [{ id: 99, name: `for-${filter}`, category: 'X' }]),
    fetchFilters: vi.fn(async () => ['All', 'Electronics', 'Apparel']),
  },
}));

// Bridge component mirroring what MvvmView does: subscribe to the VM and re-render.
function Harness({ vm }: { vm: ProductViewModel }) {
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    const unsub = vm.subscribe(() => force());
    vm.onMount();
    return () => { unsub(); vm.onUnmount(); };
  }, [vm]);
  return <ProductView data={vm.getData()} viewModel={vm} />;
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
});
