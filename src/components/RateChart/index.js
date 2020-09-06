import React from "react";
import { Chart } from "react-charts";
import produce from "immer";
import fx from "money";

/**
 * Компонент линейного графика курса валют
 * @param items элементы для построения
 * @returns {JSX.Element}
 * @constructor
 */
function RateChart({ items = [] }) {
  const data = React.useMemo(() => {
    return items.reduce(
      (prev, curr) => {
        const { date, rates } = curr;

        fx.rates = rates;

        return produce(prev, (draftState) => {
          draftState[0].data.push([
            new Date(date),
            fx.convert(1, { from: "EUR", to: "RUB" }),
          ]);
          draftState[1].data.push([
            new Date(date),
            fx.convert(1, { from: "USD", to: "RUB" }),
          ]);
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
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Chart data={data} axes={axes} tooltip />
    </div>
  );
}

export default RateChart;
