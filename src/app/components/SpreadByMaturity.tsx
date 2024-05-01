"use client";

import _ from "lodash";
import { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

import { palettes } from "@/utils/colorUtils";
import Card from "./Card";
import CardHeader from "./CardHeader";
import styles from "./MaturityBreakdown.module.css";
import { numberFormat } from "@/utils/dataUtils";
import { spreadLaneData } from "@/utils/spreadUtils";

interface chartProps {
  filter: any;
  unfilteredData: any;
  filteredData: any;
  handleFilterUpdate: Function;
  handleFilterUpdates: Function;
}

const SpreadByMaturity = ({
  filter,
  unfilteredData,
  filteredData,
  handleFilterUpdate,
  handleFilterUpdates,
}: chartProps) => {
  // Hold some data in component state
  const [earliestYear, setEarliestYear] = useState(0);
  const [latestYear, setLatestYear] = useState(0);

  useEffect(() => {
    // Remove maturities without spread values
    let maturitiesWithSpreadValues = _.filter(
      unfilteredData,
      (maturity: any) => {
        return maturity["Spread"] != "-";
      }
    );
    // Build an array of years with total par amounts
    let yearArray = _.map(maturitiesWithSpreadValues, (maturity: any) => {
      return maturity.Structure;
    });
    setEarliestYear(_.min(yearArray));
    setLatestYear(_.max(yearArray));
  }, [unfilteredData]);

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
              let dealCount = spreadGrouping.length;
              return {
                id: `${maturity}-${spreadLane}`,
                maturity,
                spreadLane,
                totalPar,
                dealCount,
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
  _.times(yearSpan, (index: number) => {
    let year = earliestYear + index;
    _.each(_.slice(_.keys(spreadLaneData), 1), (spreadLane: string) => {
      // find existing objects for this combination of year and spread lane
      let unfilteredItem = _.find(unfilteredParByMaturity, (item: any) => {
        return item.maturity === year && item.spreadLane === spreadLane;
      });
      let filteredItem = _.find(filteredParByMaturity, (item: any) => {
        return item.maturity === year && item.spreadLane === spreadLane;
      });
      // if nothing is found, add one with zero total par
      if (unfilteredItem === undefined) {
        unfilteredParByMaturity.push({
          id: `${year}-${spreadLane}`,
          maturity: year,
          spreadLane,
          totalPar: 0,
          dealCount: 0,
        });
      }
      if (filteredItem === undefined) {
        filteredParByMaturity.push({
          id: `${year}-${spreadLane}`,
          maturity: year,
          spreadLane,
          totalPar: 0,
          dealCount: 0,
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

  const tooltipFormatter = (value: any, name: string, props: any) => {
    // Choose the right format based on field name
    if (props) {
      if (props.name === "totalPar") {
        return [`${numberFormat(props.value, "par-axis")}Mn`, "Total Par"];
      } else if (props.name === "spreadLane") {
        return [spreadLaneData[props.value].label, "Spread"];
      } else if (props.name === "maturity") {
        return [props.value, "Year"];
      } else if (props.name === "dealCount") {
        return [props.value, "Deal Count"];
      }
    }
    return false;
  };

  const handleClick = (event: any) => {
    // handleFilterUpdate("spread", event.spreadLane);
    handleFilterUpdates([
      { key: "maturities", value: event.maturity },
      { key: "spread", value: event.spreadLane },
    ]);
  };

  const handleAxisClick = (value: any) => {
    handleFilterUpdate("spread", `${value}`);
  };

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
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              xAxisId={1}
              stroke={palettes.grayscale[6]}
              interval={0}
              type="number"
              allowDuplicatedCategory={true}
              dataKey="maturity"
              domain={[earliestYear, latestYear]}
              tickFormatter={(value: any) => {
                return `'${`${value}`.slice(-2)}`;
              }}
              tickCount={latestYear - earliestYear + 1}
            />
            <YAxis
              stroke={palettes.grayscale[6]}
              type="category"
              allowDuplicatedCategory={false}
              dataKey="spreadLane"
              tickFormatter={(value: any, index: number) => {
                return spreadLaneData[value].label;
              }}
              onClick={(event: any) => handleAxisClick(event.value)}
            />
            <ZAxis type="number" dataKey="totalPar" range={[0, 1000]} />
            <Tooltip formatter={tooltipFormatter} />
            <Scatter
              xAxisId={1}
              name="Unfiltered Spread by Maturity"
              id="id"
              type="number"
              data={unfilteredParByMaturity}
              fill={palettes.grayscale[2]}
              onClick={handleClick}
            />
            <Scatter
              id="id"
              xAxisId={1}
              name="Filtered Spread by Maturity"
              type="number"
              data={filteredParByMaturity}
              fill={palettes.red[6]}
              onClick={handleClick}>
              {filteredParByMaturity.map((entry: any, index: number) => {
                let colors: Record<string, any> = {
                  a: palettes.blue[4],
                  b: palettes.turquoise[4],
                  c: palettes.green[4],
                  d: palettes.yellow[3],
                  e: palettes.orange[4],
                  f: palettes.red[4],
                };
                return (
                  <Cell key={`cell-${index}`} fill={colors[entry.spreadLane]} />
                );
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default SpreadByMaturity;
