"use client";

import _ from "lodash";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import Card from "./Card";
import CardHeader from "./CardHeader";
import styles from "./MaturityBreakdown.module.css";
import { mapRating } from "@/utils/dataUtils";

interface chartProps {
  chartData: any;
}

const MaturityBreakdown = ({ chartData }: chartProps) => {
  // Build an array of years with total par amounts
  const yearsPresent = _.map(chartData, (maturity: any) => {
    return maturity.Structure;
  });
  // Get the time span represented by the data
  const earliestYear = _.min(yearsPresent);
  const latestYear = _.max(yearsPresent);
  const yearSpan = latestYear - earliestYear + 1;
  // Get maturities keyed by year
  const parByMaturity = _(chartData)
    .filter((obj: any) => obj.Structure != "-")
    .groupBy("Structure")
    .map((objs: any, key: string) => ({
      name: key,
      par: _.sumBy(objs, "Par ($M)"),
    }))
    .value();
  // Loop through years in range and add in empty buckets
  _.times(yearSpan, (index: number) => {
    let year = earliestYear + index + "";
    let existingYear = _.find(parByMaturity, (item: any) => {
      return item.name === year;
    });
    if (existingYear === undefined) {
      parByMaturity.push({
        name: year,
        par: 0,
      });
    }
  });

  return (
    <Card>
      <CardHeader label="Deals by Maturity" />
      <div className={styles["chart__wrapper"]}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          style={{ flex: 1, fontSize: ".75rem" }}>
          <BarChart
            width={500}
            height={300}
            data={parByMaturity}
            margin={{
              top: 20,
              right: 20,
              left: 0,
              bottom: 0,
            }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {/* <Legend /> */}
            <Bar dataKey="par" stackId="a" fill="#FFBB28" />
            {/* <Bar dataKey="Fitch" stackId="a" fill="#8884d8" />
            <Bar dataKey="Kroll" stackId="a" fill="#82ca9d" />
            <Bar dataKey="Moody's" stackId="a" fill="#FFBB28" />
            <Bar dataKey="Standard & Poor's" stackId="a" fill="#FF8042" /> */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default MaturityBreakdown;
