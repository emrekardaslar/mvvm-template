export class BaseViewModel<TData> {
  protected data: TData;
  private listeners: Set<() => void> = new Set();
  private eventListener: Map<string, ((payload?: any) => void)[]> = new Map();

  /**
   * Creates an instance of BaseViewModel.
   * @param initialData The initial data for the ViewModel.
   */
  constructor(initialData: TData) {
    this.data = initialData;
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
   * Executes all attached functions (event handlers) for a given event name.
   * @param eventName The name of the event to run attached functions for.
   * @param payload Optional data to pass to the attached functions.
   */
  public runAttachedFunction(eventName: string, payload?: any) {
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
  protected registerEvent(eventName: string, handler: (payload?: any) => void) {
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
