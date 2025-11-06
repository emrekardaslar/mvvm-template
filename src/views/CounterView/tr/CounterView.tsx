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
      <h1>Sayaç: {data.count}</h1>
      <button onClick={() => viewModel.runAttachedFunction("increment")}>
        Artır
      </button>
      <button onClick={() => viewModel.runAttachedFunction("decrement")}>
        Azalt
      </button>
    </div>
  );
};

export default CounterView;
