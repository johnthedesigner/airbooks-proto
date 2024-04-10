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
  const dataByState = _.countBy(chartData, (deal: any) => {
    return deal["State"];
  });
  const assembledData = _.map(dataByState, (value: any, abbrev: string) => {
    return {
      abbrev,
      state: stateNameFromAbbrev(abbrev),
      dealCount: value,
    };
  });

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
