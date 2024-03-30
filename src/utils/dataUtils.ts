import _ from "lodash";

// If the string contains only a hyphen, return null value instead
export const nullHyphen = (string: string) => {
  let newString = string === "-" ? null : string;
  return newString;
};

export const mapRating = (rating: string) => {
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

  const mapToArray = (input: string) => {
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
export const prepareMaturities = (rawMaturitiesList: any[]) => {
  return _.map(rawMaturitiesList, (maturity: any, index: number) => {
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

// Accept filter parameters and return updated filter object
interface filterState {
  rating: any;
  sector: any;
}
export const updateFilter = (filter: any, key: string, value: any) => {
  // Get the filter to be updated
  const currentValue = filter[key];
  if (_.includes(currentValue, value)) {
    // If this key exists, toggle presence of provided value
    return {
      ...filter,
      [key]: _.xor(currentValue, [value]),
    };
  } else {
    // If this key doesn't exist, add the key-value pair
    return {
      ...filter,
      [key]: [...currentValue, value],
    };
  }
};

// Apply filters and return resulting maturities
export const applyMaturityFilters = (formattedMaturities: any, filter: any) => {
  return _(formattedMaturities)
    .filter((m: any) => {
      return (
        // Ratings Filters
        _.includes(filter.rating, m.moodysNormal) ||
        _.includes(filter.rating, m.spNormal) ||
        _.includes(filter.rating, m.fitchNormal) ||
        _.includes(filter.rating, m.krollNormal) ||
        // Sector Filter
        _.includes(filter.sector, m.Sector) ||
        (filter.rating.length === 0 && filter.sector.length === 0)
      );
    })
    .value();
};
