import React from "react";

import "../Counter.css";
import type { CounterViewProps } from "@domain/models/counter";
import { CounterEvents } from "@domain/events/counter";

const CounterView: React.FC<CounterViewProps> = ({ data, viewModel }) => {
  if (data.isLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="counter-container">
      <h1>Sayaç: {data.count}</h1>
      <div className="counter-buttons">
        <button
          className="counter-button increment"
          onClick={() => viewModel.runAttachedFunction(CounterEvents.Increment)}>
          Artır
        </button>
        <button
          className="counter-button decrement"
          onClick={() => viewModel.runAttachedFunction(CounterEvents.Decrement)}>
          Azalt
        </button>
      </div>
    </div>
  );
};

export default CounterView;
