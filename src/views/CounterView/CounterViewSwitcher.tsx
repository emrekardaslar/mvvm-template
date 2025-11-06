import React from "react";
import LangViewSwitcher from "../../components/LangViewSwitcher";
import { CounterViewModel } from "../../viewmodels/CounterViewModel";

interface CounterViewSwitcherProps {
  initialData: {
    count: number;
  };
}

const CounterViewSwitcher: React.FC<CounterViewSwitcherProps> = ({
  initialData,
}) => {
  return (
    <LangViewSwitcher
      ViewModelClass={CounterViewModel}
      initialData={initialData}
      viewName="CounterView"
    />
  );
};

export default CounterViewSwitcher;
