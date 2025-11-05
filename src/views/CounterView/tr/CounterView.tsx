import React from "react";
import { useViewModel } from "../../../hooks/useViewModel";
import { CounterViewModel } from "../../../viewmodels/CounterViewModel";

interface CounterViewProps {
  viewModel: CounterViewModel;
}

const CounterView: React.FC<CounterViewProps> = ({ viewModel }) => {
  const data = useViewModel(viewModel);

  if (data.isLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div>
      <h1>{data.title}: {data.count}</h1>
      <button onClick={() => viewModel.runAttachedFunction('increment')}>{data.increment}</button>
      <button onClick={() => viewModel.runAttachedFunction('decrement')}>{data.decrement}</button>
    </div>
  );
};

export default CounterView;
