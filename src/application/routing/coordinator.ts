import { FilterEvents } from '@domain/events/filter';
import { LanguageEvents } from '@domain/events/language';
import { PagerEvents } from '@domain/events/pager';
import eventBus from '../events/eventBus';

interface NavigateOptions {
  replace?: boolean;      // Use replaceState instead of pushState
  clearAll?: boolean;     // Clear all existing params first
  clearParams?: string[]; // Clear specific params before merging
}

class Coordinator {
  private isClient: boolean;

  constructor() {
    this.isClient = typeof window !== 'undefined';

    if (this.isClient) {
      this.setupEventListeners();
      this.setupPopStateHandler();
    }
  }

  /**
   * Navigate to a new URL with updated query parameters
   * @param params - Key-value pairs for query parameters (use null/undefined to remove)
   * @param options - Navigation options
   */
  public navigate(
    params: Record<string, string | number | undefined | null>,
    options: NavigateOptions = {}
  ): void {
    if (!this.isClient) {
      console.warn('Coordinator.navigate() called on server');
      return;
    }

    const { replace = false, clearAll = false, clearParams = [] } = options;

    // Build new URLSearchParams
    const searchParams = clearAll
      ? new URLSearchParams()
      : new URLSearchParams(window.location.search);

    // Clear specific params if requested
    clearParams.forEach(param => searchParams.delete(param));

    // Update with new params
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        searchParams.delete(key);
      } else {
        searchParams.set(key, String(value));
      }
    });

    // Build new URL
    const newSearch = searchParams.toString();
    const newUrl = `${window.location.pathname}${newSearch ? '?' + newSearch : ''}`;

    // Update browser history
    if (replace) {
      window.history.replaceState({}, '', newUrl);
    } else {
      window.history.pushState({}, '', newUrl);
    }
  }

  /**
   * Get current URL parameters
   */
  public getCurrentParams(): URLSearchParams {
    if (!this.isClient) {
      return new URLSearchParams();
    }
    return new URLSearchParams(window.location.search);
  }

  /**
   * Set up event listeners to synchronize EventBus events with URL
   */
  private setupEventListeners(): void {
    // Language change - clear page when language changes
    eventBus.on(LanguageEvents.Changed, (payload: { lang: string }) => {
      this.navigate({ lang: payload.lang }, { clearParams: ['page'] });
    });

    // Filter change - reset to page 1 and update category
    eventBus.on(FilterEvents.Changed, (payload: { filter: string }) => {
      this.navigate({
        category: payload.filter,
        page: 1
      });
    });

    // Page change - just update page number
    eventBus.on(PagerEvents.Changed, (payload: { page: number }) => {
      this.navigate({ page: payload.page });
    });
  }

  /**
   * Handle browser back/forward navigation
   */
  private setupPopStateHandler(): void {
    window.addEventListener('popstate', () => {
      const params = this.getCurrentParams();

      // Emit events so ViewModels can react to URL changes
      // This handles browser back/forward button
      const lang = params.get('lang');
      const category = params.get('category');
      const page = params.get('page');

      if (lang) {
        eventBus.dispatch(LanguageEvents.Changed, { lang });
      }

      if (category) {
        eventBus.dispatch(FilterEvents.Changed, { filter: category });
      }

      if (page) {
        eventBus.dispatch(PagerEvents.Changed, { page: parseInt(page, 10) });
      }
    });
  }
}

const coordinator = new Coordinator();
export default coordinator;
