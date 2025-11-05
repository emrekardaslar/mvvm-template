export class BaseViewModel<TState> {
    protected state: TState;
    private listeners: Set<() => void> = new Set();
    private eventHandlers: Map<string, ((payload?: any) => void)[]> = new Map();

    constructor(initialState: TState) {
        this.state = initialState;
    }

    public getState(): TState {
        return this.state;
    }

    protected setState(newState: Partial<TState>) {
        this.state = { ...this.state, ...newState };
        this.notifyListeners();
    }

    public subscribe(listener: () => void): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notifyListeners() {
        for (const listener of this.listeners) {
            listener();
        }
    }

    protected dispatch(eventName: string, payload?: any) {
        const handlers = this.eventHandlers.get(eventName);
        if (handlers) {
            handlers.forEach(handler => handler(payload));
        }
    }

    protected on(eventName: string, handler: (payload?: any) => void) {
        if (!this.eventHandlers.has(eventName)) {
            this.eventHandlers.set(eventName, []);
        }
        this.eventHandlers.get(eventName)?.push(handler);
    }

    // To be implemented by subclasses
    public onMount(): void {
        // Optional: Logic to run when the component mounts
    }

    public onUnmount(): void {
        // Optional: Logic to run for cleanup when the component unmounts
    }
}
