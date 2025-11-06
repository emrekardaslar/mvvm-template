import React from "react";
import { useViewModel } from "../../../hooks/useViewModel";
import { CounterViewModel } from "../../../viewmodels/CounterViewModel";

interface CounterViewProps {
  viewModel: CounterViewModel;
}

const CounterView: React.FC<CounterViewProps> = ({ viewModel }) => {
  const data = useViewModel(viewModel);

  if (data.isLoading) {
    return <div>جار التحميل...</div>;
  }

  return (
    <div>
      <h1>عداد: {data.count}</h1>
      <button onClick={() => viewModel.runAttachedFunction("increment")}>
        يزيد
      </button>
      <button onClick={() => viewModel.runAttachedFunction("decrement")}>
        ينقص
      </button>
    </div>
  );
};

export default CounterView;
