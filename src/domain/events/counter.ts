export const CounterEvents = {
  Increment: 'increment',
  Decrement: 'decrement',
} as const;

export type CounterEvent = typeof CounterEvents[keyof typeof CounterEvents];
