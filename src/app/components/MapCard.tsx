"use client";

import _ from "lodash";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear, scaleQuantile } from "d3-scale";

import Card from "./Card";
import CardHeader from "./CardHeader";
import styles from "./RatingsCard.module.css";
import { stateAbbrevFromName, stateNameFromAbbrev } from "@/utils/stateUtils";
import { palettes } from "@/utils/colorUtils";

interface chartProps {
  unfilteredData: any;
  filteredData: any;
  handleFilterUpdate: Function;
  filter: any;
}

const MapCard = ({
  unfilteredData,
  filteredData,
  handleFilterUpdate,
  filter,
}: chartProps) => {
  // Sum par amount by state
  const getParTotalsByState = (data: any) => {
    return _.reduce(
      data,
      (result: any, value: any) => {
        // Get current state
        let state = value["State"];
        // Make sure we have a result object and property to start with
        result || (result = {});
        if (!result[state]) result[state] = 0;
        // Add up the par amounts to get a total by rating
        result[state] = Number(result[state]) + Number(value["Filtered Par"]);
        return result;
      },
      {}
    );
  };
  let filteredParTotalsByState = getParTotalsByState(filteredData);
  let unfilteredParTotalsByState = getParTotalsByState(unfilteredData);

  const assembledData = _.map(
    filteredParTotalsByState,
    (value: any, abbrev: string) => {
      return {
        abbrev,
        state: stateNameFromAbbrev(abbrev),
        dealCount: value,
      };
    }
  );

  const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

  const colorScaleA = scaleQuantile<string, number>()
    .domain(
      assembledData.map((d) => {
        return d.dealCount;
      })
    )
    .range([
      palettes.red[2],
      palettes.red[3],
      palettes.red[4],
      palettes.red[5],
      palettes.red[6],
      palettes.red[7],
      palettes.red[8],
      palettes.red[9],
      palettes.red[10],
    ]);

  const colorScaleB = scaleQuantile<string, number>()
    .domain(
      assembledData.map((d) => {
        return d.dealCount;
      })
    )
    .range([
      palettes.blue[2],
      palettes.blue[3],
      palettes.blue[4],
      palettes.blue[5],
      palettes.blue[6],
      palettes.blue[7],
      palettes.blue[8],
      palettes.blue[9],
      palettes.blue[10],
    ]);

  const handleClick = (data: any, index: number) => {
    handleFilterUpdate("rating", data.name);
  };

  return (
    <Card>
      <CardHeader label="Total Par by State" />
      <div className={styles["chart__wrapper"]}>
        <ComposableMap projection="geoAlbersUsa">
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const cur = assembledData.find(
                  (s) => s.state === geo.properties.name
                );
                const isSelected = _.includes(filter.state, cur?.abbrev);
                let getColor = (value: number) => {
                  if (cur) {
                    return colorScaleA(value);
                  } else {
                    return palettes.grayscale[1];
                  }
                };
                return (
                  <Geography
                    onClick={(e: any) => {
                      handleFilterUpdate(
                        "state",
                        stateAbbrevFromName(geo.properties.name)
                      );
                    }}
                    name={"TEST"}
                    key={geo.rsmKey}
                    geography={geo}
                    stroke={"rgba(0,0,0,.1"}
                    fill={getColor(cur?.dealCount) as string}
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
