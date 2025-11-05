export class BaseViewModel<TState> {
  protected state: TState;
  private listeners: Set<() => void> = new Set();
  private eventHandlers: Map<string, ((payload?: any) => void)[]> = new Map();

  /**
   * Creates an instance of BaseViewModel.
   * @param initialState The initial state for the ViewModel.
   */
  constructor(initialState: TState) {
    this.state = initialState;
  }

  /**
   * Gets the current state of the ViewModel.
   * @returns The current state.
   */
  public getState(): TState {
    return this.state;
  }

  /**
   * Updates the state of the ViewModel and notifies all subscribed listeners.
   * @param newState A partial object containing the new state properties to merge.
   */
  protected setState(newState: Partial<TState>) {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
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
   * Dispatches an event with an optional payload.
   * Handlers registered for this eventName will be executed.
   * @param eventName The name of the event to dispatch.
   * @param payload Optional data to pass to the event handlers.
   */
  protected dispatch(eventName: string, payload?: any) {
    const handlers = this.eventHandlers.get(eventName);
    if (handlers) {
      handlers.forEach((handler) => handler(payload));
    }
  }

  /**
   * Registers an event handler for a specific event name.
   * @param eventName The name of the event to listen for.
   * @param handler The function to execute when the event is dispatched.
   */
  protected registerEvent(eventName: string, handler: (payload?: any) => void) {
    if (!this.eventHandlers.has(eventName)) {
      this.eventHandlers.set(eventName, []);
    }
    this.eventHandlers.get(eventName)?.push(handler);
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
