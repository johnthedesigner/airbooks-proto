"use client";

import _ from "lodash";
import {
  BarChart,
  Bar,
  Cell,
  Label,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Card from "./Card";
import CardHeader from "./CardHeader";
import styles from "./RatingsCard.module.css";

interface chartProps {
  chartData: any;
  handleFilterUpdate: Function;
  filter: any;
}

const SectorCard = ({ chartData, handleFilterUpdate, filter }: chartProps) => {
  // Aggregate deals by sector
  const dealsFromData = _.countBy(chartData, (deal: any, index: number) => {
    return deal["Sector"];
  });
  const sectors = _.keys(dealsFromData);
  let assembledData = _.orderBy(
    _.map(sectors, (sector: string) => {
      return {
        name: sector,
        dealCount: dealsFromData[sector],
      };
    }),
    "dealCount",
    "desc"
  );

  const handleClick = (data: any, index: number) => {
    handleFilterUpdate("sector", data.name);
  };

  return (
    <Card>
      <CardHeader label="Deals by Sector" />
      <div className={styles["chart__wrapper"]}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          style={{ flex: 1, fontSize: ".75rem" }}>
          <BarChart
            width={500}
            height={300}
            data={assembledData}
            layout="horizontal"
            margin={{
              top: 20,
              right: 20,
              left: 0,
              bottom: 0,
            }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickFormatter={(value: any, index: number) => {
                return value.substring(0, 5);
              }}></XAxis>
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="dealCount"
              stackId="a"
              fill="#FF8042"
              onClick={handleClick}>
              {assembledData.map((entry, index) => {
                return (
                  <Cell
                    cursor="pointer"
                    fill={
                      _.includes(filter.sector, entry.name)
                        ? "#82ca9d"
                        : "#8884d8"
                    }
                    key={`cell-${index}`}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default SectorCard;
