import React from "react";
import LangViewSwitcher from "../../components/LangViewSwitcher";
import { CounterViewModel } from "../../viewmodels/CounterViewModel";

interface CounterViewProps {
  initialData: {
    count: number;
  };
}

const CounterViewSwitcher: React.FC<CounterViewProps> = ({ initialData }) => {
  return (
    <LangViewSwitcher
      ViewModelClass={CounterViewModel}
      initialData={initialData}
      viewName="CounterView"
    />
  );
};

export default CounterViewSwitcher;
