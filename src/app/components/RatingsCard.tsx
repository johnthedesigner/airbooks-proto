"use client";

import _ from "lodash";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import Card from "./Card";
import CardHeader from "./CardHeader";
import styles from "./RatingsCard.module.css";
import { mapRating } from "@/utils/ratingUtils";
import { numberFormat } from "@/utils/dataUtils";
import { palettes } from "@/utils/colorUtils";

interface chartProps {
  unfilteredData: any;
  filteredData: any;
  handleFilterUpdate: Function;
  filter: any;
}

const RatingsCard = ({
  unfilteredData,
  filteredData,
  handleFilterUpdate,
  filter,
}: chartProps) => {
  // Ratings categories
  const ratingsCategories = [
    "AAA",
    "AA+",
    "AA",
    "AA-",
    "A+",
    "A",
    "A-",
    "BBB+",
    "BBB",
    "BBB-",
    "BB+",
    "BB",
    "BB-",
    "B+",
    "B",
    "B-",
    "null",
  ];

  // Get object of ratings with corresponding par totals
  const ratingsReduce = (chartData: any[], ratingKey: string) => {
    let parTotals = _.reduce(
      chartData,
      (result: any, value: any) => {
        // Make sure we have a result object and property to start with
        result || (result = {});
        if (!result[value[ratingKey]]) result[value[ratingKey]] = 0;
        // Add up the par amounts to get a total by rating
        result[value[ratingKey]] =
          Number(result[value[ratingKey]]) + Number(value["Filtered Par"]);
        return result;
      },
      {}
    );
    return parTotals;
  };

  const assembleData = (data: any) => {
    // Par totals for each rating body
    let moodysParTotals = ratingsReduce(data, "moodysNormal");
    let spParTotals = ratingsReduce(data, "spNormal");
    let fitchParTotals = ratingsReduce(data, "fitchNormal");
    let krollParTotals = ratingsReduce(data, "krollNormal");
    // Grand total (with overlap) of par totals by rating
    var assembledData = new Array();
    _.each(ratingsCategories, (rating: string) => {
      assembledData.push({
        name: rating,
        value:
          (moodysParTotals[rating] || 0) +
          (spParTotals[rating] || 0) +
          (fitchParTotals[rating] || 0) +
          (krollParTotals[rating] || 0),
      });
    });
    return assembledData;
  };

  let assembledFilteredData = assembleData(filteredData);
  let assembledUnfilteredData = assembleData(unfilteredData);

  let assembledMergedData = _.map(ratingsCategories, (rating: string) => {
    let filteredValue = _.find(assembledFilteredData, (datum: any) => {
      return datum.name === rating;
    });
    let unfilteredValue = _.find(assembledUnfilteredData, (datum: any) => {
      return datum.name === rating;
    });
    return {
      name: rating,
      filteredValue: filteredValue.value,
      unfilteredValue: unfilteredValue.value - filteredValue.value,
    };
  });

  const handleClick = (data: any, index: number) => {
    handleFilterUpdate("rating", data.name);
  };

  return (
    <Card>
      <CardHeader label="Total Par by Rating ($Mn)" />
      <div className={styles["chart__wrapper"]}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          style={{ flex: 1, fontSize: ".75rem" }}>
          <BarChart
            width={500}
            height={300}
            data={assembledMergedData}
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
            <Tooltip
              formatter={(value: number) => {
                return `${numberFormat(value, "par-axis")}Mn`;
              }}
            />
            <Bar
              name="Current filter"
              dataKey="filteredValue"
              stackId="a"
              fill={palettes.yellow[3]}
              onClick={handleClick}>
              {assembledMergedData.map((entry, index) => {
                return (
                  <Cell
                    cursor="pointer"
                    fill={
                      _.includes(filter.rating, entry.name)
                        ? palettes.yellow[4]
                        : palettes.yellow[3]
                    }
                    key={`cell-${index}`}
                  />
                );
              })}
            </Bar>
            <Bar
              name="Not in current filter"
              dataKey="unfilteredValue"
              stackId="a"
              fill={palettes.grayscale[5]}
              onClick={handleClick}>
              {assembledMergedData.map((entry, index) => {
                return (
                  <Cell
                    cursor="pointer"
                    fill={
                      _.includes(filter.rating, entry.name)
                        ? palettes.grayscale[3]
                        : palettes.grayscale[2]
                    }
                    key={`cell-${index}`}
                  />
                );
              })}
            </Bar>
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

export default RatingsCard;
