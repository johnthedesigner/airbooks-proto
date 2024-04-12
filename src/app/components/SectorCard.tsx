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
import { numberFormat } from "@/utils/dataUtils";
import { palettes } from "@/utils/colorUtils";

interface chartProps {
  filteredData: any;
  unfilteredData: any;
  handleFilterUpdate: Function;
  filter: any;
}

const SectorCard = ({
  unfilteredData,
  filteredData,
  handleFilterUpdate,
  filter,
}: chartProps) => {
  const getParTotals = (data: any) => {
    // Sum par amount by sector
    let parTotals = _.reduce(
      data,
      (result: any, value: any) => {
        // Get current sector
        let sector = value["Sector"];
        // Make sure we have a result object and property to start with
        result || (result = {});
        if (!result[sector]) result[sector] = 0;
        // Add up the par amounts to get a total by rating
        result[sector] = Number(result[sector]) + Number(value["Filtered Par"]);
        return result;
      },
      {}
    );
    return parTotals;
  };

  let unfilteredParTotals = getParTotals(unfilteredData);
  let filteredParTotals = getParTotals(filteredData);

  const sectors = _.keys(unfilteredParTotals);
  let assembledData = _.orderBy(
    _.map(sectors, (sector: string) => {
      return {
        name: sector,
        parDelta:
          unfilteredParTotals[sector] - (filteredParTotals[sector] || 0),
        unfilteredPar: unfilteredParTotals[sector],
        filteredPar: filteredParTotals[sector] || 0,
      };
    }),
    "unfilteredPar",
    "desc"
  );

  const handleClick = (data: any, index: number) => {
    handleFilterUpdate("sector", data.name);
  };

  return (
    <Card>
      <CardHeader label="Total Par by Sector ($Mn)" />
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
              left: 20,
              bottom: 0,
            }}>
            <CartesianGrid
              stroke={palettes.grayscale[2]}
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="name"
              stroke={palettes.grayscale[6]}
              tickFormatter={(value: any) => {
                return value.substring(0, 5);
              }}></XAxis>
            <YAxis
              stroke={palettes.grayscale[6]}
              tickFormatter={(value: any) => {
                return numberFormat(Number(value), "par-axis") || "";
              }}
            />
            <Tooltip
              formatter={(value: number) => {
                return `${numberFormat(value, "par-axis")}Mn`;
              }}
            />
            <Bar
              name="Current filter"
              dataKey="filteredPar"
              stackId="a"
              fill={palettes.orange[5]}
              onClick={handleClick}>
              {assembledData.map((entry, index) => {
                return (
                  <Cell
                    cursor="pointer"
                    fill={
                      _.includes(filter.sector, entry.name)
                        ? palettes.orange[5]
                        : palettes.orange[4]
                    }
                    key={`cell-${index}`}
                  />
                );
              })}
            </Bar>
            <Bar
              name="Not in current filter"
              dataKey="parDelta"
              stackId="a"
              fill={palettes.grayscale[5]}
              onClick={handleClick}>
              {assembledData.map((entry, index) => {
                return (
                  <Cell
                    cursor="pointer"
                    fill={
                      _.includes(filter.sector, entry.name)
                        ? palettes.grayscale[3]
                        : palettes.grayscale[2]
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
