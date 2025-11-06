import React from "react";
import type { CounterViewProps } from "../../../model/counter";

const CounterView: React.FC<CounterViewProps> = ({ data, viewModel }) => {
  if (data.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Counter: {data.count}</h1>
      <button onClick={() => viewModel.runAttachedFunction("increment")}>
        Increment
      </button>
      <button onClick={() => viewModel.runAttachedFunction("decrement")}>
        Decrement
      </button>
    </div>
  );
};

export default CounterView;
