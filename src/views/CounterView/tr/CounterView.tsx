import React from "react";
import type { CounterViewProps } from "../../../models/counter";
import "../Counter.css";

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
          onClick={() => viewModel.runAttachedFunction("increment")}>
          Artır
        </button>
        <button
          className="counter-button decrement"
          onClick={() => viewModel.runAttachedFunction("decrement")}>
          Azalt
        </button>
      </div>
    </div>
  );
};

export default CounterView;
