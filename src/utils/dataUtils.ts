import _ from "lodash";
import numeral from "numeral";

// Import JSON data and organize into weeks
import dealData20240318 from "../data/deals-2024-3-18.json";
import maturityData20240318 from "../data/maturities-2024-3-18.json";
import dealData20240325 from "../data/deals-2024-3-25.json";
import maturityData20240325 from "../data/maturities-2024-3-25.json";
import { mapRatings } from "./ratingUtils";

export const calendarData = {
  weeks: [
    {
      index: 0,
      date: "2024/03/18",
      deals: mapRatings(dealData20240318),
      maturities: maturityData20240318,
    },
    {
      index: 1,
      date: "2024/03/25",
      deals: mapRatings(dealData20240325),
      maturities: maturityData20240325,
    },
  ],
};

// If the string contains only a hyphen, return null value instead
export const nullHyphen = (string: string) => {
  let newString = string === "-" ? null : string;
  return newString;
};

export const singleValue = (string: string) => {
  let newString = string?.toString().split(",")[0];
  return newString;
};

export const numberFormat = (value: number, type: string) => {
  switch (type) {
    case "par-axis":
      return numeral(value).divide(1000).format("($0,0)");
      break;

    case "par-table":
      return numeral(value).format("(0,0)");
      break;
  }
};
