import _ from "lodash";
// const fs = require("fs");
import fs from "fs";

const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

const loadData = (path) => {
  try {
    return fs.readFileSync(path, "utf8");
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const mapRating = (rating) => {
  console.log("CHECK RATING", rating);
  // Only use one rating when other values are provided
  rating = rating.split(",")[0];
  rating = rating.split(" (")[0];
  // Strip asterisk
  rating = rating.split("*")[0];

  // Define
  const ratingsA = ["A", "A2"];
  const ratingsAMinus = ["A-", "A3"];
  const ratingsAPlus = ["A+", "A1"];
  const ratingsAA = ["AA", "Aa", "Aa2"];
  const ratingsAAMinus = ["AA-", "Aa3"];
  const ratingsAAPlus = ["AA+", "Aa1"];
  const ratingsAAA = ["AAA", "Aaa", "Aaa2"];
  const ratingsB = ["B", "B2"];
  const ratingsBMinus = ["B-", "B3"];
  const ratingsBPlus = ["B+", "B1"];
  const ratingsBB = ["BB", "Ba2", "Ba"];
  const ratingsBBMinus = ["BB-", "Ba3"];
  const ratingsBBPlus = ["BB+", "Ba1"];
  const ratingsBBB = ["BBB", "Baa2", "Baa"];
  const ratingsBBBMinus = ["BBB-", "Baa3"];
  const ratingsBBBPlus = ["BBB+", "Baa1"];

  const mapToArray = (input) => {
    if (_.includes(ratingsA, rating)) {
      return "A";
    } else if (_.includes(ratingsAMinus, rating)) {
      return "A-";
    } else if (_.includes(ratingsAPlus, rating)) {
      return "A+";
    } else if (_.includes(ratingsAA, rating)) {
      return "AA";
    } else if (_.includes(ratingsAAMinus, rating)) {
      return "AA-";
    } else if (_.includes(ratingsAAPlus, rating)) {
      return "AA+";
    } else if (_.includes(ratingsAAA, rating)) {
      return "AAA";
    } else if (_.includes(ratingsB, rating)) {
      return "B";
    } else if (_.includes(ratingsBMinus, rating)) {
      return "B-";
    } else if (_.includes(ratingsBPlus, rating)) {
      return "B+";
    } else if (_.includes(ratingsBB, rating)) {
      return "BB";
    } else if (_.includes(ratingsBBMinus, rating)) {
      return "BB-";
    } else if (_.includes(ratingsBBPlus, rating)) {
      return "BB+";
    } else if (_.includes(ratingsBBB, rating)) {
      return "BBB";
    } else if (_.includes(ratingsBBBMinus, rating)) {
      return "BBB-";
    } else if (_.includes(ratingsBBBPlus, rating)) {
      return "BBB+";
    } else {
      return "Not Rated";
    }
  };

  return mapToArray(rating);
};

// Normalize certain fields for easier use in the UI
const mapRatings = (rawMaturitiesList) => {
  // console.log("MATURITIES LSIT", rawMaturitiesList);
  return _.map(rawMaturitiesList, (maturity, index) => {
    console.log("CURRENT MATURITY", maturity);
    let moodysNormal = mapRating(maturity["Moody's"]);
    let spNormal = mapRating(maturity["Standard & Poor's"]);
    let fitchNormal = mapRating(maturity["Fitch"]);
    let krollNormal = mapRating(maturity["Kroll"]);
    return {
      ...maturity,
      moodysNormal,
      spNormal,
      fitchNormal,
      krollNormal,
    };
  });
};

const mapDealMaturityData = (deals, maturities) => {
  // Build chart data for each deal's maturity structure
  // Get a list of maturity years
  let maturityArray = _.uniq(
    _.map(maturities, (maturity) => {
      return Number(maturity.Structure);
    })
  );
  // Get the earliest and latest years
  let earliestYear = _.min(maturityArray) || 0;
  let latestYear = _.max(maturityArray) || 0;
  // Build a new deals array
  return _.map(deals, (deal) => {
    // Get all maturities for this deal
    let structureArray = _.filter(maturities, (maturity) => {
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
      let currentMaturity = _.find(structureArray, (maturity) => {
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
        key: `${maturity.Index}-${maturity.Structure}`,
      });
    }
    return {
      ...deal,
      structureArray,
      structureChartData: data,
    };
  });
};

// Get data and organize it
let dealPath20240318 = "./src/data/deals-2024-3-18.json";
let dealPath20240325 = "./src/data/deals-2024-3-25.json";
let maturityPath20240318 = "./src/data/maturities-2024-3-18.json";
let maturityPath20240325 = "./src/data/maturities-2024-3-25.json";

const calendarData = [
  {
    index: 0,
    date: "2024/03/18",
    deals: mapDealMaturityData(
      mapRatings(JSON.parse(loadData(dealPath20240318))),
      JSON.parse(loadData(maturityPath20240318))
    ),
    maturities: JSON.parse(loadData(maturityPath20240318)),
  },
  {
    index: 1,
    date: "2024/03/25",
    deals: mapDealMaturityData(
      mapRatings(JSON.parse(loadData(dealPath20240325))),
      JSON.parse(loadData(maturityPath20240325))
    ),
    maturities: JSON.parse(loadData(maturityPath20240325)),
  },
];

storeData(calendarData, "./src/data/calendar-data.json");
