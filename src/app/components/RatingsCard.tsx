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
} from "recharts";

import Card from "./Card";
import CardHeader from "./CardHeader";
import styles from "./RatingsCard.module.css";
import { mapRating } from "@/utils/ratingUtils";

interface chartProps {
  chartData: any;
  handleFilterUpdate: Function;
  filter: any;
}

const RatingsCard = ({ chartData, handleFilterUpdate, filter }: chartProps) => {
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
          Number(result[value[ratingKey]]) + Number(value["Par ($M)"]);
        return result;
      },
      {}
    );
    return parTotals;
  };
  // Par totals for each rating body
  let moodysParTotals = ratingsReduce(chartData, "moodysNormal");
  let spParTotals = ratingsReduce(chartData, "spNormal");
  let fitchParTotals = ratingsReduce(chartData, "fitchNormal");
  let krollParTotals = ratingsReduce(chartData, "krollNormal");
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

  const handleClick = (data: any, index: number) => {
    console.log("BAR CLICKED", data, index);
    handleFilterUpdate("rating", data.name);
  };

  return (
    <Card>
      <CardHeader label="Total Par by Rating" />
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
              left: 0,
              bottom: 0,
            }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="value"
              stackId="a"
              fill="#FF8042"
              onClick={handleClick}>
              {assembledData.map((entry, index) => {
                return (
                  <Cell
                    cursor="pointer"
                    fill={
                      _.includes(filter.rating, entry.name)
                        ? "#82ca9d"
                        : "#8884d8"
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
