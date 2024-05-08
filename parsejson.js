import _ from "lodash";
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

// Define rating mapping values and return simple rating
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
  if (_.includes(ratingsAAA, input)) {
    return "AAA";
  } else if (_.includes(ratingsAAPlus, input)) {
    return "AA+";
  } else if (_.includes(ratingsAA, input)) {
    return "AA";
  } else if (_.includes(ratingsAAMinus, input)) {
    return "AA-";
  } else if (_.includes(ratingsAPlus, input)) {
    return "A+";
  } else if (_.includes(ratingsA, input)) {
    return "A";
  } else if (_.includes(ratingsAMinus, input)) {
    return "A-";
  } else if (_.includes(ratingsBBBPlus, input)) {
    return "BBB+";
  } else if (_.includes(ratingsBBB, input)) {
    return "BBB";
  } else if (_.includes(ratingsBBBMinus, input)) {
    return "BBB-";
  } else if (_.includes(ratingsBBPlus, input)) {
    // return "BB+";
    return "<IG";
  } else if (_.includes(ratingsBB, input)) {
    // return "BB";
    return "<IG";
  } else if (_.includes(ratingsBBMinus, input)) {
    // return "BB-";
    return "<IG";
  } else if (_.includes(ratingsBPlus, input)) {
    // return "B+";
    return "<IG";
  } else if (_.includes(ratingsB, input)) {
    // return "B";
    return "<IG";
  } else if (_.includes(ratingsBMinus, input)) {
    // return "B-";
    return "<IG";
  } else {
    return "Not Rated";
  }
};

export const mapRating = (rating) => {
  // Only use one rating when other values are provided
  rating = rating.split(",")[0];
  rating = rating.split(" (")[0];
  // Strip asterisk
  rating = rating.split("*")[0];
  return mapToArray(rating);
};

// Make sure all coupon fields contain only one value, or are empty ("-")
const getCleanCoupon = (maturity) => {
  // If there's no coupon return empty value
  if (maturity["Coupon"] === "-") return maturity["Coupon"];
  // Take first value from comma separated coupon list
  return Number(`${maturity["Coupon"]}`.split(",")[0]);
};
const cleanCoupons = (maturityData) => {
  return _.map(maturityData, (maturity) => {
    // Return maturity with coupon replaced by clean coupon value
    return {
      ...maturity,
      Coupon: getCleanCoupon(maturity),
    };
  });
};

// Normalize certain fields for easier use in the UI
const mapRatings = (rawMaturitiesList) => {
  return _.map(rawMaturitiesList, (maturity, index) => {
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
      structureIndex <= latestYear;
      structureIndex++
    ) {
      // Get the matching maturity (may be undefined)
      let currentMaturity = _.find(structureArray, (maturity) => {
        return maturity.Structure === structureIndex;
      });
      // Add par amount if maturity exists this year, or else zero
      data.push({
        name: `${structureIndex}`,
        par: currentMaturity ? currentMaturity["Filtered Par"] : 0,
        coupon: currentMaturity ? currentMaturity["Coupon"] : "-",
        structureIndex,
        key: `${deal.Index}-${structureIndex}`,
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
    maturities: cleanCoupons(JSON.parse(loadData(maturityPath20240318))),
  },
  {
    index: 1,
    date: "2024/03/25",
    deals: mapDealMaturityData(
      mapRatings(JSON.parse(loadData(dealPath20240325))),
      JSON.parse(loadData(maturityPath20240325))
    ),
    maturities: cleanCoupons(JSON.parse(loadData(maturityPath20240325))),
  },
];

storeData(calendarData, "./src/data/calendar-data.json");
