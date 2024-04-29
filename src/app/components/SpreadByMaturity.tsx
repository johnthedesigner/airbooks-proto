"use client";

import _, { spread } from "lodash";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  Line,
  LineChart,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

import { palettes } from "@/utils/colorUtils";
import Card from "./Card";
import CardHeader from "./CardHeader";
import styles from "./MaturityBreakdown.module.css";
import { numberFormat } from "@/utils/dataUtils";

interface chartProps {
  filter: any;
  unfilteredData: any;
  filteredData: any;
  handleFilterUpdate: Function;
}

const spreadLanes = ["-", "a", "b", "c", "d", "e", "f"];
const spreadLaneData: Record<string, any> = {
  "-": {
    key: "-",
    label: "NA",
  },
  a: {
    key: "a",
    label: "<1",
    max: 1,
  },
  b: {
    key: "b",
    label: "<5",
    max: 5,
  },
  c: {
    key: "c",
    label: "<10",
    max: 10,
  },
  d: {
    key: "d",
    label: "<5",
    max: 50,
  },
  e: {
    key: "e",
    label: "<75",
    max: 75,
  },
  f: {
    key: "f",
    label: "75+",
    max: 100000,
  },
};

const SpreadByMaturity = ({
  filter,
  unfilteredData,
  filteredData,
  handleFilterUpdate,
}: chartProps) => {
  // Build an array of years with total par amounts
  const yearsPresent = _.map(unfilteredData, (maturity: any) => {
    return maturity.Structure;
  });
  // Function for determining which range of spreads a maturity falls into
  const getSpreadRange = (maturity: any) => {
    // from spread data, take first value and remove plus sign if present
    let simpleSpread = Number(
      `${maturity["Spread"]}`.split(",")[0].replace("+", "")
    );
    if (Number.isNaN(simpleSpread)) {
      return spreadLaneData["-"].key;
    } else if (simpleSpread < spreadLaneData.a.max) {
      return spreadLaneData.a.key;
    } else if (simpleSpread < spreadLaneData.b.max) {
      return spreadLaneData.b.key;
    } else if (simpleSpread < spreadLaneData.c.max) {
      return spreadLaneData.c.key;
    } else if (simpleSpread < spreadLaneData.d.max) {
      return spreadLaneData.d.key;
    } else if (simpleSpread < spreadLaneData.e.max) {
      return spreadLaneData.e.key;
    } else {
      return spreadLaneData.f.key;
    }
  };
  // Get the time span represented by the data
  const earliestYear = _.min(yearsPresent);
  const latestYear = _.max(yearsPresent);
  const yearSpan = latestYear - earliestYear + 1;
  // Get maturities keyed by year
  let getSpreadByMaturity = (data: any) => {
    const spreadByMaturity = _(data)
      .filter((obj: any) => obj.Structure != "-")
      .groupBy("Structure")
      .map((maturityGrouping: any, key: string) => {
        // Build maturity/spread grouping object with aggregated par amounts
        let aggregateByMaturity: Record<string, any> = {
          name: key,
          totalPar: _.sumBy(maturityGrouping, "Filtered Par"),
          spreadLanes: _(maturityGrouping)
            .groupBy((maturity: any) => {
              return getSpreadRange(maturity);
            })
            .map((spreadGrouping: any) => {
              let maturity = Number(spreadGrouping[0].Structure);
              let spreadLane = getSpreadRange(spreadGrouping[0]);
              let totalPar = _.sumBy(spreadGrouping, "Filtered Par");
              return {
                id: `${maturity}-${spreadLane}`,
                maturity,
                spreadLane,
                totalPar,
              };
            })
            .value(),
        };
        return aggregateByMaturity;
      })
      .value();
    // Ungroup by maturity to get objects for scatterplot
    let ungroupedSpreadByMaturity = new Array();
    _(spreadByMaturity).each((maturityGroup: any) => {
      _(maturityGroup.spreadLanes).each((dataPoint: any) => {
        ungroupedSpreadByMaturity.push(dataPoint);
      });
    });
    // Return object, filtering out values with no spread
    return _.filter(ungroupedSpreadByMaturity, (item: any) => {
      return item.spreadLane != "-";
    });
  };
  // get Par by maturity for filtered and unfiltered data
  let unfilteredParByMaturity = getSpreadByMaturity(unfilteredData);
  let filteredParByMaturity = getSpreadByMaturity(filteredData);
  // Get scatterplot viz configuration items
  let parValueArray = _.map(unfilteredParByMaturity, (item) => {
    return Number(item.totalPar);
  });
  let maxParValue = _.max(parValueArray);
  let domain = [0, maxParValue || 100];
  // Loop through years in range and add in data for empty spots
  //   console.log(
  //     "CHECK ARRAY LENGTHS",
  //     unfilteredParByMaturity.length,
  //     filteredParByMaturity.length
  //   );
  _.times(yearSpan, (index: number) => {
    let year = earliestYear + index;
    // console.log("LOOPING THROUGH YEAR", year);
    _.each(_.slice(spreadLanes, 1), (spreadLane: string) => {
      //   console.log("LOOPING THROUGH SPREAD LANES", spreadLane);
      // find existing objects for this combination of year and spread lane
      let unfilteredItem = _.find(unfilteredParByMaturity, (item: any) => {
        return item.maturity === year && item.spreadLane === spreadLane;
      });
      let filteredItem = _.find(filteredParByMaturity, (item: any) => {
        return item.maturity === year && item.spreadLane === spreadLane;
      });
      // if nothing is found, add one with zero total par
      if (unfilteredItem === undefined) {
        // console.log("FILTERED ITEM IS DEFINED");
        unfilteredParByMaturity.push({
          id: `${year}-${spreadLane}`,
          maturity: year,
          spreadLane,
          totalPar: 0,
        });
      }
      if (filteredItem === undefined) {
        // console.log("FILTERED ITEM IS UNDEFINED");
        filteredParByMaturity.push({
          id: `${year}-${spreadLane}`,
          maturity: year,
          spreadLane,
          totalPar: 0,
        });
      }
    });
  });
  // Make sure data is consistently sorted by year and spreadLane
  filteredParByMaturity = _.orderBy(
    filteredParByMaturity,
    ["maturity", "spreadLane"],
    ["asc", "asc"]
  );
  unfilteredParByMaturity = _.orderBy(
    unfilteredParByMaturity,
    ["maturity", "spreadLane"],
    ["asc", "asc"]
  );

  //   const handleClick = (data: any, index: number) => {
  //     handleFilterUpdate("maturities", `${data.name}`);
  //   };

  return (
    <Card>
      <CardHeader label="Total Par by Spread across Maturities ($Mn)" />
      <div className={styles["chart__wrapper"]}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          style={{ flex: 1, fontSize: ".75rem" }}>
          <ScatterChart
            width={500}
            height={400}
            // data={unfilteredParByMaturity}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              stroke={palettes.grayscale[6]}
              interval={0}
              scale="linear"
              type="number"
              dataKey="maturity"
              domain={[earliestYear, latestYear]}
              tickFormatter={(value: any) => {
                return `'${`${value}`.slice(-2)}`;
              }}
            />
            <YAxis
              stroke={palettes.grayscale[6]}
              type="category"
              allowDuplicatedCategory={false}
              dataKey="spreadLane"
              tickFormatter={(value: any, index: number) => {
                return spreadLaneData[value].label;
              }}
            />
            <ZAxis
              type="number"
              dataKey="totalPar"
              domain={domain}
              range={[0, 1000]}
            />
            <Tooltip
              formatter={(value: number, key: any) => {
                console.log("TOOLTIP VALUE", value);
                // return `${numberFormat(value, "par-axis")}Mn`;
                if (key === "totalPar") {
                  return [`${numberFormat(value, "par-axis")}Mn`, "Total Par"];
                } else if (key === "spreadLane") {
                  return [spreadLaneData[value].label, "Spread"];
                } else if (key === "maturity") {
                  return [value, "Year"];
                }
                return false;
              }}
            />
            <Scatter
              id="id"
              name="Unfiltered"
              type="number"
              data={unfilteredParByMaturity}
              fill={palettes.grayscale[2]}
            />
            <Scatter
              id="id"
              name="Filtered"
              type="number"
              data={filteredParByMaturity}
              fill={palettes.red[6]}>
              {filteredParByMaturity.map((entry: any, index: number) => {
                let colors: Record<string, any> = {
                  a: palettes.blue[4],
                  b: palettes.turquoise[4],
                  c: palettes.green[4],
                  d: palettes.yellow[3],
                  e: palettes.orange[4],
                  f: palettes.red[4],
                };
                // console.log("ENTRY", entry, colors[entry.spreadLane]);
                return (
                  <Cell key={`cell-${index}`} fill={colors[entry.spreadLane]} />
                );
              })}
            </Scatter>
            {/* <Bar
              //   type="monotone"
              dataKey="spreadLane2"
              stackId="1"
              //   stroke="#82ca9d"
              stroke={palettes.yellow[4]}
              fill={palettes.yellow[4]}
            />
            <Bar
              //   type="monotone"
              dataKey="spreadLane3"
              stackId="1"
              //   stroke="#ffc658"
              stroke={palettes.green[4]}
              fill={palettes.green[4]}
            />
            <Bar
              //   type="monotone"
              dataKey="spreadLane4"
              stackId="1"
              //   stroke="#8884d8"
              stroke={palettes.blue[4]}
              fill={palettes.blue[4]}
            />
            <Bar
              //   type="monotone"
              dataKey="spreadLane5"
              stackId="1"
              //   stroke="#82ca9d"
              stroke={palettes.purple[4]}
              fill={palettes.purple[4]}
            />
            <Bar
              //   type="monotone"
              dataKey="spreadLane6"
              stackId="1"
              //   stroke="#ffc658"
              stroke={palettes.magenta[4]}
              fill={palettes.magenta[4]}
            /> */}
          </ScatterChart>
        </ResponsiveContainer>
        {/* <ResponsiveContainer
          width="100%"
          height="100%"
          style={{ flex: 1, fontSize: ".75rem" }}>
          <BarChart
            width={500}
            height={300}
            data={assembledData}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 0,
            }}>
            <CartesianGrid
              stroke={palettes.grayscale[2]}
              strokeDasharray="3 3"
            />
            <XAxis stroke={palettes.grayscale[6]} dataKey="name" />
            <YAxis
              stroke={palettes.grayscale[6]}
              tickFormatter={(value: any) => {
                return numberFormat(Number(value), "par-axis") || "";
              }}
            />
            <Tooltip
              formatter={(value: number) => {
                return `${numberFormat(value, "par-axis")}Mn`;
              }}
            />
            <Bar
              name="Current filter"
              dataKey="filteredValue"
              stackId="a"
              fill={palettes.blue[6]}
              onClick={handleClick}>
              {assembledData.map((entry, index) => {
                return (
                  <Cell
                    cursor="pointer"
                    fill={
                      _.includes(filter.maturities, entry.name)
                        ? palettes.blue[7]
                        : palettes.blue[5]
                    }
                    key={`cell-${index}`}
                  />
                );
              })}
            </Bar>
            <Bar
              name="Not in current filter"
              dataKey="unfilteredValue"
              stackId="a"
              fill={palettes.grayscale[2]}
              onClick={handleClick}>
              {assembledData.map((entry, index) => {
                return (
                  <Cell
                    cursor="pointer"
                    fill={
                      _.includes(filter.maturities, entry.name)
                        ? palettes.grayscale[3]
                        : palettes.grayscale[2]
                    }
                    key={`cell-${index}`}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer> */}
      </div>
    </Card>
  );
};

export default SpreadByMaturity;
