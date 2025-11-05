type EventHandler = (payload?: any) => void;

class EventBus {
    private eventHandlers: Map<string, EventHandler[]> = new Map();

    public on(eventName: string, handler: EventHandler): void {
        if (!this.eventHandlers.has(eventName)) {
            this.eventHandlers.set(eventName, []);
        }
        this.eventHandlers.get(eventName)?.push(handler);
    }

    public dispatch(eventName: string, payload?: any): void {
        const handlers = this.eventHandlers.get(eventName);
        if (handlers) {
            handlers.forEach(handler => handler(payload));
        }
    }

    public off(eventName: string, handler: EventHandler): void {
        const handlers = this.eventHandlers.get(eventName);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }
}

const eventBus = new EventBus();
export default eventBus;
