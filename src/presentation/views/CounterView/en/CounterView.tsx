import React from "react";

import "../Counter.css";
import type { CounterViewProps } from "@domain/models/counter";
import { CounterEvents } from "@domain/events/counter";

const CounterView: React.FC<CounterViewProps> = ({ data, viewModel }) => {
  if (data.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="counter-container">
      <h1>Counter: {data.count}</h1>
      <div className="counter-buttons">
        <button
          className="counter-button increment"
          onClick={() => viewModel.dispatchEvent(CounterEvents.Increment)}>
          Increment
        </button>
        <button
          className="counter-button decrement"
          onClick={() => viewModel.dispatchEvent(CounterEvents.Decrement)}>
          Decrement
        </button>
      </div>
    </div>
  );
};

export default CounterView;
