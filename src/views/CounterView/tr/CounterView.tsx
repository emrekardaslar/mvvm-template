import React from "react";
import type { CounterViewProps } from "../../../models/counter";

const CounterView: React.FC<CounterViewProps> = ({ data, viewModel }) => {
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
