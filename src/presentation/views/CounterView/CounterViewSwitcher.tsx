import React from "react";

import { CounterViewModel } from "@application/viewmodels/CounterViewModel";
import LangViewSwitcher from "@presentation/components/LangViewSwitcher";

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
