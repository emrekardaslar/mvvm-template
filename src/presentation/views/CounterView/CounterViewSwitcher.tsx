import React from "react";

import { CounterViewModel } from "../../viewmodels/CounterViewModel";
import LangViewSwitcher from "../../../services/LangViewSwitcher";

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
