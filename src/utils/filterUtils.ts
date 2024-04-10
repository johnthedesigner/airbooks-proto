import _ from "lodash";

// Initial filter state
export const filterState = {
  rating: [],
  sector: [],
};

// Interface for managing filter state
export interface filterStateInterface {
  rating?: string[];
  sector?: string[];
}

export interface filterItemInterface {
  label: string;
  key: string;
  options: any[];
}

export interface filterListInterface {
  [rating: string]: filterItemInterface;
  sector: filterItemInterface;
}

export const filterList: filterListInterface = {
  rating: {
    label: "Rating",
    key: "rating",
    options: [
      { label: "BB", value: "BB" },
      { label: "BBB", value: "BBB" },
      { label: "A-", value: "A-" },
      { label: "A", value: "A" },
      { label: "A+", value: "A+" },
      { label: "AA-", value: "AA-" },
      { label: "AA", value: "AA" },
      { label: "AA+", value: "AA+" },
      { label: "AAA", value: "AAA" },
    ],
  },
  sector: {
    label: "Sector",
    key: "sector",
    options: [
      { label: "Transportation", value: "Transportation" },
      { label: "Water & Sewer", value: "Water & Sewer" },
      { label: "Education", value: "Education" },
      { label: "Health Care", value: "Health Care" },
      { label: "Power", value: "Power" },
      { label: "Housing", value: "Housing" },
      { label: "Miscellaneous", value: "Miscellaneous" },
      { label: "General Purposes", value: "General Purposes" },
      { label: "Industrial Development", value: "Industrial Development" },
      { label: "Public Buildings", value: "Public Buildings" },
      { label: "Economic Development", value: "Economic Development" },
      {
        label: "Public Buildings, Water & Sewer",
        value: "Public Buildings, Water & Sewer",
      },
      { label: "Utilities - Other", value: "Utilities - Other" },
      {
        label: "General Purposes, Education",
        value: "General Purposes, Education",
      },
      {
        label: "General Purposes, Transportation",
        value: "General Purposes, Transportation",
      },
    ],
  },
};

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

export const substituteFilter = (filter: any, key: string, value: any) => {
  return {
    ...filter,
    [key]: value,
  };
};

// Apply filters and return resulting maturities
export const applyDealFilters = (deals: any, filter: any) => {
  return _(deals)
    .filter((m: any) => {
      return (
        (filter.rating.length === 0 && filter.sector.length === 0) ||
        // Ratings Filters
        _.includes(filter.rating, m.moodysNormal) ||
        _.includes(filter.rating, m.spNormal) ||
        _.includes(filter.rating, m.fitchNormal) ||
        _.includes(filter.rating, m.krollNormal) ||
        // Sector Filter
        _.includes(filter.sector, m.Sector)
      );
    })
    .value();
};

export const applyFilters = async (
  deals: any,
  maturities: any,
  filter: any
) => {
  // Filter deals based on current filter values
  let filteredDeals = await applyDealFilters(deals, filter);
  // Get the indexes of the resulting list of deals
  let dealIndexes = await _.map(filteredDeals, (deal: any) => {
    return deal.Index;
  });
  // Filter maturities to only those from the filtered deals
  let filteredMaturities = await _.filter(maturities, (maturity: any) => {
    return _.includes(dealIndexes, maturity.Index);
  });
  // Return filtered lists to the UI
  return {
    deals: filteredDeals,
    maturities: filteredMaturities,
  };
};
