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
    "B-",
    "B",
    "B+",
    "BB-",
    "BB",
    "BB+",
    "BBB-",
    "BBB",
    "BBB+",
    "A-",
    "A",
    "A+",
    "AA-",
    "AA",
    "AA+",
    "AAA",
    "null",
  ];

  // Get mapped ratings from each source
  const moodysRatings = _.countBy(chartData, (maturity: any) => {
    return mapRating(maturity["Moody's"]);
  });
  const spRatings = _.countBy(chartData, (maturity: any) => {
    return mapRating(maturity["Standard & Poor's"]);
  });
  const fitchRatings = _.countBy(chartData, (maturity: any) => {
    return mapRating(maturity["Fitch"]);
  });
  const krollRatings = _.countBy(chartData, (maturity: any) => {
    return mapRating(maturity["Kroll"]);
  });

  var assembledData = new Array();
  _.each(ratingsCategories, (ratingString: string, index: number) => {
    // Count # of deals by each rating body
    let dealCountMoodys = moodysRatings[ratingString]
      ? moodysRatings[ratingString]
      : 0;
    let dealCountSP = spRatings[ratingString] ? spRatings[ratingString] : 0;
    let dealCountFitch = fitchRatings[ratingString]
      ? fitchRatings[ratingString]
      : 0;
    let dealCountKroll = krollRatings[ratingString]
      ? krollRatings[ratingString]
      : 0;
    // Only return non-empty rating categories
    if (dealCountMoodys + dealCountSP + dealCountFitch + dealCountKroll != 0) {
      assembledData.push({
        name: ratingString,
        dealCount:
          dealCountMoodys + dealCountSP + dealCountFitch + dealCountKroll,
        "Moody's": dealCountMoodys,
        "Standard & Poor's": dealCountSP,
        Fitch: dealCountFitch,
        Kroll: dealCountKroll,
      });
    }
  });

  const handleClick = (data: any, index: number) => {
    console.log("BAR CLICKED", data, index);
    handleFilterUpdate("rating", data.name);
  };

  return (
    <Card>
      <CardHeader label="Deals by Rating" />
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
              dataKey="dealCount"
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
