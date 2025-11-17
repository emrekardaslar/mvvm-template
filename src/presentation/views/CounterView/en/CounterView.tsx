import React from "react";

import "../Counter.css";
import type { CounterViewProps } from "../../../../domain/models/counter";

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
          onClick={() => viewModel.runAttachedFunction("increment")}>
          Increment
        </button>
        <button
          className="counter-button decrement"
          onClick={() => viewModel.runAttachedFunction("decrement")}>
          Decrement
        </button>
      </div>
    </div>
  );
};

export default CounterView;
