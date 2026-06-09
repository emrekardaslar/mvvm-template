import React from "react";

import "../Counter.css";
import type { CounterViewProps } from "@domain/models/counter";
import { CounterEvents } from "@domain/events/counter";

const CounterView: React.FC<CounterViewProps> = ({ data, viewModel }) => {
  if (data.isLoading) {
    return <div>YÃ¼kleniyor...</div>;
  }

  return (
    <div className="counter-container">
      <h1>SayaÃ§: {data.count}</h1>
      <div className="counter-buttons">
        <button
          className="counter-button increment"
          onClick={() => viewModel.dispatchEvent(CounterEvents.Increment)}>
          ArtÄ±r
        </button>
        <button
          className="counter-button decrement"
          onClick={() => viewModel.dispatchEvent(CounterEvents.Decrement)}>
          Azalt
        </button>
      </div>
    </div>
  );
};

export default CounterView;
