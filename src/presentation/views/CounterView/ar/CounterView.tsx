import React from "react";

import "../Counter.css";
import type { CounterViewProps } from "../../../../domain/models/counter";

const CounterView: React.FC<CounterViewProps> = ({ data, viewModel }) => {
  if (data.isLoading) {
    return <div dir="rtl">جار التحميل...</div>;
  }

  return (
    <div className="counter-container" dir="rtl">
      <h1>عداد: {data.count}</h1>
      <div className="counter-buttons">
        <button
          className="counter-button increment"
          onClick={() => viewModel.runAttachedFunction("increment")}>
          يزيد
        </button>
        <button
          className="counter-button decrement"
          onClick={() => viewModel.runAttachedFunction("decrement")}>
          ينقص
        </button>
      </div>
    </div>
  );
};

export default CounterView;
