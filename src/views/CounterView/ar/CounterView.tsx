import React, { useState } from "react";
import { useViewModel } from "../../../hooks/useViewModel";
import { CounterViewModel } from "../../../viewmodels/CounterViewModel";

interface CounterViewProps {
  initialData: ReturnType<CounterViewModel["getData"]>;
}

const CounterView: React.FC<CounterViewProps> = ({ initialData }) => {
  const [viewModel] = useState(() => new CounterViewModel(initialData));
  const data = useViewModel(viewModel);

  return data.isLoading ? (
    <p>جارٍ التحميل...</p>
  ) : (
    <div>
            <h1>{data.title}: {data.count}</h1>
            <button onClick={() => viewModel.runAttachedFunction('increment')}>{data.increment}</button>
            <button onClick={() => viewModel.runAttachedFunction('decrement')}>{data.decrement}</button>
    </div>
  );
};

export default CounterView;
