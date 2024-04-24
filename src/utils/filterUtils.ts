import _ from "lodash";
import { singleValue } from "./dataUtils";

// Initial filter state
export const filterState = {
  rating: [],
  maturities: [],
  sector: [],
  state: [],
  leadManager: [],
  taxStatus: [],
  offeringType: [],
};

// Interface for managing filter state
export interface filterStateInterface {
  rating?: string[];
  maturities?: string[];
  sector?: string[];
  state?: string[];
  leadManager?: string[];
  taxStatus?: string[];
  offeringType?: string[];
}

export interface filterItemInterface {
  label: string;
  key: string;
  options?: any[];
}

export interface filterListInterface {
  [rating: string]: filterItemInterface;
  maturities: filterItemInterface;
  sector: filterItemInterface;
  state: filterItemInterface;
  leadManager: filterItemInterface;
  taxStatus: filterItemInterface;
  offeringType: filterItemInterface;
}

export const filterList: filterListInterface = {
  maturities: {
    label: "Maturities",
    key: "maturities",
  },
  leadManager: {
    label: "Lead Manager",
    key: "leadManager",
  },
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
  state: {
    label: "State",
    key: "state",
    options: [
      { value: "AL", label: "Alabama" },
      { value: "AK", label: "Alaska" },
      { value: "AS", label: "American Samoa" },
      { value: "AZ", label: "Arizona" },
      { value: "AR", label: "Arkansas" },
      { value: "CA", label: "California" },
      { value: "CO", label: "Colorado" },
      { value: "CT", label: "Connecticut" },
      { value: "DE", label: "Delaware" },
      { value: "DC", label: "District Of Columbia" },
      { value: "FM", label: "Federated States Of Micronesia" },
      { value: "FL", label: "Florida" },
      { value: "GA", label: "Georgia" },
      { value: "GU", label: "Guam" },
      { value: "HI", label: "Hawaii" },
      { value: "ID", label: "Idaho" },
      { value: "IL", label: "Illinois" },
      { value: "IN", label: "Indiana" },
      { value: "IA", label: "Iowa" },
      { value: "KS", label: "Kansas" },
      { value: "KY", label: "Kentucky" },
      { value: "LA", label: "Louisiana" },
      { value: "ME", label: "Maine" },
      { value: "MH", label: "Marshall Islands" },
      { value: "MD", label: "Maryland" },
      { value: "MA", label: "Massachusetts" },
      { value: "MI", label: "Michigan" },
      { value: "MN", label: "Minnesota" },
      { value: "MS", label: "Mississippi" },
      { value: "MO", label: "Missouri" },
      { value: "MT", label: "Montana" },
      { value: "NE", label: "Nebraska" },
      { value: "NV", label: "Nevada" },
      { value: "NH", label: "New Hampshire" },
      { value: "NJ", label: "New Jersey" },
      { value: "NM", label: "New Mexico" },
      { value: "NY", label: "New York" },
      { value: "NC", label: "North Carolina" },
      { value: "ND", label: "North Dakota" },
      { value: "MP", label: "Northern Mariana Islands" },
      { value: "OH", label: "Ohio" },
      { value: "OK", label: "Oklahoma" },
      { value: "OR", label: "Oregon" },
      { value: "PW", label: "Palau" },
      { value: "PA", label: "Pennsylvania" },
      { value: "PR", label: "Puerto Rico" },
      { value: "RI", label: "Rhode Island" },
      { value: "SC", label: "South Carolina" },
      { value: "SD", label: "South Dakota" },
      { value: "TN", label: "Tennessee" },
      { value: "TX", label: "Texas" },
      { value: "UT", label: "Utah" },
      { value: "VT", label: "Vermont" },
      { value: "VI", label: "Virgin Islands" },
      { value: "VA", label: "Virginia" },
      { value: "WA", label: "Washington" },
      { value: "WV", label: "West Virginia" },
      { value: "WI", label: "Wisconsin" },
      { value: "WY", label: "Wyoming" },
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
  taxStatus: {
    label: "Tax Status",
    key: "taxStatus",
    options: [
      { label: "T-E", value: "T-E" },
      { label: "Tax", value: "Tax" },
      { label: "AMT", value: "AMT" },
    ],
  },
  offeringType: {
    label: "Offering Type",
    key: "offeringType",
    options: [
      { label: "Negotiated", value: "Negotiated" },
      { label: "Competitive", value: "Competitive" },
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
export const applyDealFilters = async (deals: any, filter: any) => {
  let filteredDeals = await _(deals)
    .filter((m: any) => {
      return (
        (filter.rating.length === 0 &&
          filter.sector.length === 0 &&
          filter.state.length === 0 &&
          filter.taxStatus.length === 0) ||
        // Ratings Filters
        _.includes(filter.rating, singleValue(m.moodysNormal)) ||
        _.includes(filter.rating, singleValue(m.spNormal)) ||
        _.includes(filter.rating, singleValue(m.fitchNormal)) ||
        _.includes(filter.rating, singleValue(m.krollNormal)) ||
        // Sector Filter
        _.includes(filter.sector, singleValue(m.Sector)) ||
        // State Filter
        _.includes(filter.state, singleValue(m.State)) ||
        // Tax Status Filter
        _.includes(filter.taxStatus, singleValue(m["Tax Status"]))
      );
    })
    .value();

  // Get deals filtered by rating
  let byRating = await _(deals)
    .filter((deal: any) => {
      return (
        filter.rating.length === 0 ||
        _.includes(filter.rating, singleValue(deal.moodysNormal)) ||
        _.includes(filter.rating, singleValue(deal.spNormal)) ||
        _.includes(filter.rating, singleValue(deal.fitchNormal)) ||
        _.includes(filter.rating, singleValue(deal.krollNormal))
      );
    })
    .value();

  // Get deals filtered by maturity
  const yearOnly = (yearString: string) => {
    // Remove "(P)" for put bonds
    return yearString.split("(")[0];
  };
  let byMaturity = await _(deals)
    .filter((deal: any) => {
      // Make sure Structure is a string
      let dealStructure = `${deal.Structure}`;
      // Get an array of maturities from the Structure field
      let dealMaturities = _.map(dealStructure.split(", "), yearOnly);
      return (
        filter.maturities.length === 0 ||
        _.intersection(dealMaturities, filter.maturities).length > 0
      );
    })
    .value();

  // Get deals filtered by sector
  let bySector = await _(deals)
    .filter((deal: any) => {
      return (
        filter.sector.length === 0 ||
        _.includes(filter.sector, singleValue(deal.Sector))
      );
    })
    .value();

  // Get deals filtered by state
  let byState = await _(deals)
    .filter((deal: any) => {
      return (
        filter.state.length === 0 ||
        _.includes(filter.state, singleValue(deal.State))
      );
    })
    .value();

  // Get deals filtered by state
  let byLeadManager = await _(deals)
    .filter((deal: any) => {
      return (
        filter.leadManager.length === 0 ||
        _.includes(filter.leadManager, singleValue(deal["Lead Manager"]))
      );
    })
    .value();

  // Get deals filtered by tax status
  let byTaxStatus = await _(deals)
    .filter((deal: any) => {
      return (
        filter.taxStatus.length === 0 ||
        _.includes(filter.taxStatus, singleValue(deal["Tax Status"]))
      );
    })
    .value();

  // Get deals filtered by offering type
  let byOfferingType = await _(deals)
    .filter((deal: any) => {
      return (
        filter.offeringType.length === 0 ||
        _.includes(filter.offeringType, singleValue(deal["Offering Type"]))
      );
    })
    .value();

  let byIntersection = await _.intersection(
    byRating,
    byMaturity,
    bySector,
    byState,
    byLeadManager,
    byTaxStatus,
    byOfferingType
  );

  return {
    allDeals: filteredDeals,
    byRating,
    byMaturity,
    bySector,
    byState,
    byLeadManager,
    byTaxStatus,
    byOfferingType,
    byIntersection,
  };
};

export const applyFilters = async (
  deals: any,
  maturities: any,
  filter: any
) => {
  // Filter deals based on current filter values
  let filteredDeals = await applyDealFilters(deals, filter);
  // Get the indexes of the resulting list of deals
  let dealIndexes = await _.map(filteredDeals.byIntersection, (deal: any) => {
    return deal.Index;
  });
  // Filter maturities to only those from the filtered deals
  let filteredMaturities = await _.filter(maturities, (maturity: any) => {
    return _.includes(dealIndexes, maturity.Index);
  });
  // Return filtered lists to the UI
  return {
    deals: filteredDeals.allDeals,
    filteredDeals,
    filteredMaturities,
  };
};
