"use client";

import _ from "lodash";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear, scaleQuantile } from "d3-scale";

import Card from "./Card";
import CardHeader from "./CardHeader";
import styles from "./RatingsCard.module.css";
import { stateNameFromAbbrev } from "@/utils/stateUtils";

interface chartProps {
  chartData: any;
  handleFilterUpdate: Function;
  filter: any;
}

const MapCard = ({ chartData, handleFilterUpdate, filter }: chartProps) => {
  // const dataByState = _.countBy(chartData, (deal: any) => {
  //   return deal["State"];
  // });
  // Sum par amount by state
  let parTotalsByState = _.reduce(
    chartData,
    (result: any, value: any) => {
      // Get current state
      let state = value["State"];
      // Make sure we have a result object and property to start with
      result || (result = {});
      if (!result[state]) result[state] = 0;
      // Add up the par amounts to get a total by rating
      result[state] = Number(result[state]) + Number(value["Par ($M)"]);
      return result;
    },
    {}
  );
  console.log("CHECK PAR BY STATE", parTotalsByState);

  const assembledData = _.map(
    parTotalsByState,
    (value: any, abbrev: string) => {
      return {
        abbrev,
        state: stateNameFromAbbrev(abbrev),
        dealCount: value,
      };
    }
  );

  const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

  const colorScale = scaleQuantile<string, number>()
    .domain(
      assembledData.map((d) => {
        return d.dealCount;
      })
    )
    .range([
      "#ffad9f",
      "#ff8a75",
      "#ff5533",
      "#e2492d",
      "#be3d26",
      "#9a311f",
      "#782618",
    ]);

  const handleClick = (data: any, index: number) => {
    handleFilterUpdate("rating", data.name);
  };

  return (
    <Card>
      <CardHeader label="Deals by State" />
      <div className={styles["chart__wrapper"]}>
        <ComposableMap projection="geoAlbersUsa">
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const cur = assembledData.find(
                  (s) => s.state === geo.properties.name
                );
                return (
                  <Geography
                    onClick={(e: any) => {
                      console.log(e);
                    }}
                    key={geo.rsmKey}
                    geography={geo}
                    fill={cur ? (colorScale(cur.dealCount) as string) : "#EEE"}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
    </Card>
  );
};

export default MapCard;
