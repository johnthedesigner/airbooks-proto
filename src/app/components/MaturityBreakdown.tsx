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

import { palettes } from "@/utils/colorUtils";
import Card from "./Card";
import CardHeader from "./CardHeader";
import styles from "./MaturityBreakdown.module.css";
import { numberFormat } from "@/utils/dataUtils";

interface chartProps {
  unfilteredData: any;
  filteredData: any;
}

const MaturityBreakdown = ({ unfilteredData, filteredData }: chartProps) => {
  // Build an array of years with total par amounts
  const yearsPresent = _.map(unfilteredData, (maturity: any) => {
    return maturity.Structure;
  });
  // Get the time span represented by the data
  const earliestYear = _.min(yearsPresent);
  const latestYear = _.max(yearsPresent);
  const yearSpan = latestYear - earliestYear + 1;
  // Get maturities keyed by year
  let getParByMaturity = (data: any) => {
    const parByMaturity = _(data)
      .filter((obj: any) => obj.Structure != "-")
      .groupBy("Structure")
      .map((objs: any, key: string) => ({
        name: key,
        par: _.sumBy(objs, "Filtered Par"),
      }))
      .value();
    return parByMaturity;
  };
  // get Par by maturity for filtered and unfiltered data
  let unfilteredParByMaturity = getParByMaturity(unfilteredData);
  let filteredParByMaturity = getParByMaturity(filteredData);
  // Assembled into chart data
  var assembledData = new Array();
  // Loop through years in range and add in data
  _.times(yearSpan, (index: number) => {
    let year = earliestYear + index + "";
    let unfilteredItem = _.find(unfilteredParByMaturity, (item: any) => {
      return item.name === year;
    });
    let unfilteredValue = unfilteredItem ? Number(unfilteredItem.par) : 0;
    let filteredItem = _.find(filteredParByMaturity, (item: any) => {
      return item.name === year;
    });
    let filteredValue = filteredItem ? Number(filteredItem.par) : 0;
    assembledData.push({
      name: year,
      unfilteredValue: unfilteredValue - filteredValue,
      filteredValue,
    });
  });

  return (
    <Card>
      <CardHeader label="Total Par by Maturity ($Mn)" />
      <div className={styles["chart__wrapper"]}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          style={{ flex: 1, fontSize: ".75rem" }}>
          <BarChart
            width={500}
            height={300}
            data={assembledData}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 0,
            }}>
            <CartesianGrid
              stroke={palettes.grayscale[2]}
              strokeDasharray="3 3"
            />
            <XAxis stroke={palettes.grayscale[6]} dataKey="name" />
            <YAxis
              stroke={palettes.grayscale[6]}
              tickFormatter={(value: any) => {
                return numberFormat(Number(value), "par-axis") || "";
              }}
            />
            <Tooltip />
            {/* <Legend/> */}
            <Bar
              dataKey="filteredValue"
              stackId="a"
              fill={palettes.purple[6]}
            />
            <Bar
              dataKey="unfilteredValue"
              stackId="a"
              fill={palettes.purple[2]}
            />
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
