import _ from "lodash";
import numeral from "numeral";

// Import JSON data and organize into weeks
import dealData20240318 from "../data/deals-2024-3-18.json";
import maturityData20240318 from "../data/maturities-2024-3-18.json";
import dealData20240325 from "../data/deals-2024-3-25.json";
import maturityData20240325 from "../data/maturities-2024-3-25.json";
import { mapRatings } from "./ratingUtils";

const mapDealMaturityData = (deals: any[], maturities: any[]) => {
  // Build chart data for each deal's maturity structure
  // Get a list of maturity years
  let maturityArray = _.uniq(
    _.map(maturities, (maturity: any) => {
      return Number(maturity.Structure);
    })
  );
  // Get the earliest and latest years
  let earliestYear = _.min(maturityArray) || 0;
  let latestYear = _.max(maturityArray) || 0;
  // Build a new deals array
  return _.map(deals, (deal: any) => {
    // Get all maturities for this deal
    let structureArray = _.filter(maturities, (maturity: any) => {
      return maturity.Index === deal.Index;
    });
    // Build chart data array and populate it with maturity data from this deal
    let data = new Array();
    for (
      let structureIndex = earliestYear;
      structureIndex < latestYear;
      structureIndex++
    ) {
      // console.log("IS THIS WORKING?", deal);
      let currentMaturity = _.find(structureArray, (maturity: any) => {
        // console.log(
        //   "MATCHING MATURITIES",
        //   deal.structureArray,
        //   maturity.Structure
        // );
        return maturity.Structure === structureIndex;
      });
      // console.log("LOOPING MATURITIES", currentMaturity);
      // Add par amount if maturity exists this year, or else zero
      data.push({
        name: `${structureIndex}`,
        par: currentMaturity ? currentMaturity["Filtered Par"] : 0,
        structureIndex,
      });
    }
    return {
      ...deal,
      structureArray,
      structureChartData: data,
    };
  });
};

export const calendarData = {
  weeks: [
    {
      index: 0,
      date: "2024/03/18",
      deals: mapDealMaturityData(
        mapRatings(dealData20240318),
        maturityData20240318
      ),
      maturities: maturityData20240318,
    },
    {
      index: 1,
      date: "2024/03/25",
      deals: mapDealMaturityData(
        mapRatings(dealData20240325),
        maturityData20240325
      ),
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
