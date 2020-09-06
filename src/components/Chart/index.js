import React from "react";
import { Chart } from "react-charts";
import produce from "immer";

function MyRateChart({ items = [] }) {
  const data = React.useMemo(() => {
    return items.reduce(
      (prev, curr) => {
        const {
          date,
          rates: { EUR, USD },
        } = curr;

        return produce(prev, (draftState) => {
          draftState[0].data.push([new Date(date), EUR]);
          draftState[1].data.push([new Date(date), USD]);
        });
      },
      [
        {
          label: "USD",
          data: [],
        },
        {
          label: "EUR",
          data: [],
        },
      ]
    );
  }, [items]);

  const axes = React.useMemo(
    () => [
      { primary: true, type: "time", position: "bottom" },
      { type: "linear", position: "left" },
    ],
    []
  );

  return (
    // A react-chart hyper-responsively and continuously fills the available
    // space of its parent element automatically
    <div
      style={{
        width: "400px",
        height: "300px",
      }}
    >
      <Chart data={data} axes={axes} tooltip />
    </div>
  );
}

export default MyRateChart;
