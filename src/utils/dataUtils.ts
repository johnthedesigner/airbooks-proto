import _ from "lodash";

// If the string contains only a hyphen, return null value instead
export const nullHyphen = (string: string) => {
  let newString = string === "-" ? null : string;
  return newString;
};

export const singleValue = (string: string) => {
  let newString = string?.toString().split(",")[0];
  return newString;
};
