import _ from "lodash";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

import { palettes } from "@/utils/colorUtils";
import { useEffect, useState } from "react";

interface componentInterface {
  deal: any;
  filter: any;
}

const StructureSpark = ({ deal, filter }: componentInterface) => {
  const [chartData, setChartData] = useState(new Array());
  useEffect(() => {
    setChartData(deal.structureChartData);
  }, [deal]);
  //   console.log("DEAL DATA", deal.structureChartData);
  return (
    <div style={{ width: "10rem", height: "1.5rem" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={50}
          height={10}
          layout="horizontal"
          data={chartData}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}>
          <YAxis
            type="number"
            // domain={maturityRange}
            dataKey="par"
            hide={true}
          />
          <XAxis type="category" dataKey="name" hide={true} />
          <Bar dataKey="par" stackId="a" fill={palettes.blue[5]}>
            {chartData.map((entry: any) => {
              return (
                <Cell
                  cursor="pointer"
                  fill={
                    filter.maturities.length === 0
                      ? palettes.blue[5]
                      : _.includes(filter.maturities, entry.name)
                      ? palettes.blue[5]
                      : palettes.blue[2]
                  }
                  key={`cell-${entry.key}`}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StructureSpark;
