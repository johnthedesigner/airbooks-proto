"use client";

import _ from "lodash";
import {
  BarChart,
  Bar,
  //   Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import Card from "./Card";
import CardHeader from "./CardHeader";
import styles from "./CategoryCard.module.css";
import { mapRating } from "@/utils/dataUtils";

interface chartProps {
  chartData: any;
}

const CategoryCard = ({ chartData }: chartProps) => {
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
        "Moody's": dealCountMoodys,
        "Standard & Poor's": dealCountSP,
        Fitch: dealCountFitch,
        Kroll: dealCountKroll,
      });
    }
  });

  return (
    <Card>
      <CardHeader label="Deals by Rating" />
      <div className={styles["chart__wrapper"]}>
        <ResponsiveContainer width="100%" height="100%" style={{ flex: 1 }}>
          <BarChart
            width={500}
            height={300}
            data={assembledData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Fitch" stackId="a" fill="#8884d8" />
            <Bar dataKey="Kroll" stackId="a" fill="#82ca9d" />
            <Bar dataKey="Moody's" stackId="a" fill="#FFBB28" />
            <Bar dataKey="Standard & Poor's" stackId="a" fill="#FF8042" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default CategoryCard;
