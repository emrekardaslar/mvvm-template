import React from "react";

import "../Counter.css";
import type { CounterViewProps } from "@domain/models/counter";
import { CounterEvents } from "@domain/events/counter";

const CounterView: React.FC<CounterViewProps> = ({ data, viewModel }) => {
  if (data.isLoading) {
    return <div dir="rtl">Ø¬Ø§Ø± Ø§Ù„ØªØ­Ù…ÙŠÙ„...</div>;
  }

  return (
    <div className="counter-container" dir="rtl">
      <h1>Ø¹Ø¯Ø§Ø¯: {data.count}</h1>
      <div className="counter-buttons">
        <button
          className="counter-button increment"
          onClick={() => viewModel.dispatchEvent(CounterEvents.Increment)}>
          ÙŠØ²ÙŠØ¯
        </button>
        <button
          className="counter-button decrement"
          onClick={() => viewModel.dispatchEvent(CounterEvents.Decrement)}>
          ÙŠÙ†Ù‚Øµ
        </button>
      </div>
    </div>
  );
};

export default CounterView;
