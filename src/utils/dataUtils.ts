import _ from "lodash";
import numeral from "numeral";

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
