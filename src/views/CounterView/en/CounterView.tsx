import React from "react";
import { useViewModel } from "../../../hooks/useViewModel";
import { CounterViewModel } from "../../../viewmodels/CounterViewModel";

interface CounterViewProps {
  viewModel: CounterViewModel;
}

const CounterView: React.FC<CounterViewProps> = ({ viewModel }) => {
  const data = useViewModel(viewModel);

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
