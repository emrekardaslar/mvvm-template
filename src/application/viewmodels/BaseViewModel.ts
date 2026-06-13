import { setViewModel } from "./viewModelRegistry";

/**
 * Base class for all ViewModels.
 * @typeParam TData The shape of the ViewModel's state.
 * @typeParam TEvents A map of event name → payload type for events the views
 * may dispatch. Defaults to no events, so `dispatchEvent` is statically
 * unusable unless the subclass declares its event map.
 */
export class BaseViewModel<TData, TEvents extends Record<string, unknown> = Record<string, never>> {
  protected data: TData;
  private listeners: Set<() => void> = new Set();
  private eventListener: Map<keyof TEvents, ((payload: any) => void)[]> = new Map();

  /**
   * Creates an instance of BaseViewModel.
   * @param initialData The initial data for the ViewModel.
   */
  constructor(initialData: TData) {
    this.data = initialData;
    // Register as the active page ViewModel so queries can read it via
    // getViewModel() to build their params. One VM is active per page.
    setViewModel(this);
  }

  /**
   * Gets the current data of the ViewModel.
   * @returns The current data.
   */
  public getData(): TData {
    return this.data;
  }

  /**
   * Updates the data of the ViewModel and notifies all subscribed listeners.
   * @param newData A partial object containing the new data properties to merge.
   */
  protected setData(newData: Partial<TData>) {
    this.data = { ...this.data, ...newData };
    this.notifyListeners();
  }

  /**
   * Sets the ViewModel's error message. Public so the query runner can write a
   * common error to the active ViewModel without each call site handling it.
   * VMs whose data has no `error` field simply ignore the write at runtime.
   */
  public setError(message: string) {
    this.setData({ error: message } as unknown as Partial<TData>);
  }

  /**
   * Toggles a loading flag. Public so the query runner can manage loading
   * without each call site passing a callback. Defaults to `isLoading`; pass a
   * different key for a flag that should not dim other consumers (e.g. a
   * "load more" flag the product list does not read).
   */
  public setLoading(loading: boolean, key: keyof TData = "isLoading" as keyof TData) {
    this.setData({ [key]: loading } as unknown as Partial<TData>);
  }

  /**
   * Subscribes a listener function to state changes.
   * @param listener The function to call when the state changes.
   * @returns A function to unsubscribe the listener.
   */
  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notifies all registered listeners that the state has changed.
   * @private
   */
  private notifyListeners() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  /**
   * Dispatches an event to the ViewModel, executing all handlers registered for it.
   * The event name and payload are checked against the ViewModel's event map.
   * @param eventName The name of the event to dispatch.
   * @param payload The payload declared for this event in the event map.
   */
  public dispatchEvent<K extends keyof TEvents>(eventName: K, payload: TEvents[K]) {
    const handlers = this.eventListener.get(eventName);
    if (handlers) {
      handlers.forEach((handler) => handler(payload));
    }
  }

  /**
   * Registers an event handler for a specific event name.
   * @param eventName The name of the event to listen for.
   * @param handler The function to execute when the event is dispatched.
   */
  protected registerEvent<K extends keyof TEvents>(eventName: K, handler: (payload: TEvents[K]) => void) {
    if (!this.eventListener.has(eventName)) {
      this.eventListener.set(eventName, []);
    }
    this.eventListener.get(eventName)?.push(handler);
  }

  /**
   * Lifecycle method called when the associated View component mounts.
   * To be overridden by subclasses for initialization logic.
   */
  public onMount(): void {
    // Optional: Logic to run when the component mounts
  }

  /**
   * Lifecycle method called when the associated View component unmounts.
   * To be overridden by subclasses for cleanup logic.
   */
  public onUnmount(): void {
    // Optional: Logic to run for cleanup when the component unmounts
  }
}
