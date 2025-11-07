import React from "react";
import type { CounterViewProps } from "../../../models/counter";

const CounterView: React.FC<CounterViewProps> = ({ data, viewModel }) => {
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
