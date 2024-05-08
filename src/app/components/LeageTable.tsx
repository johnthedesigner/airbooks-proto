"use client";

import _ from "lodash";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import Card from "./Card";
import CardHeader from "./CardHeader";
import styles from "./RatingsCard.module.css";
import { Table } from "@mui/joy";
import { numberFormat } from "@/utils/dataUtils";
import { palettes } from "@/utils/colorUtils";

interface chartProps {
  unfilteredData: any;
  filteredData: any;
  handleFilterUpdate: Function;
  filter: any;
}

const LeagueTable = ({
  unfilteredData,
  filteredData,
  handleFilterUpdate,
  filter,
}: chartProps) => {
  const [filterApplied, setFilterApplied] = useState(false);

  useEffect(() => {
    let newFilterApplied = false;
    _.each(filter, (valueArray: string[]) => {
      if (valueArray.length > 0) {
        newFilterApplied = true;
      }
    });
    setFilterApplied(newFilterApplied);
  }, [filter]);

  const getParTotals = (data: any) => {
    // Sum par amount by sector
    let parTotals = _.reduce(
      data,
      (result: any, value: any) => {
        // Get current sector
        let sector = value["Lead Manager"];
        // Make sure we have a result object and property to start with
        result || (result = {});
        if (!result[sector]) result[sector] = 0;
        // Add up the par amounts to get a total by rating
        result[sector] = Number(result[sector]) + Number(value["Filtered Par"]);
        return result;
      },
      {}
    );
    return parTotals;
  };

  let unfilteredParTotals = getParTotals(unfilteredData);
  let filteredParTotals = getParTotals(filteredData);

  const leads = _.keys(unfilteredParTotals);
  let assembledData = _.orderBy(
    _.map(leads, (lead: string) => {
      return {
        name: lead,
        parDelta: unfilteredParTotals[lead] - (filteredParTotals[lead] || 0),
        unfilteredPar: unfilteredParTotals[lead],
        filteredPar: filteredParTotals[lead] || 0,
      };
    }),
    "unfilteredPar",
    "desc"
  );
  const handleClick = (data: any, index: number) => {
    handleFilterUpdate("rating", data.name);
  };

  const SparkLine = ({ data, scale }: any) => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={50}
          height={10}
          layout="vertical"
          data={data}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}>
          <XAxis
            type="number"
            domain={[0, scale]}
            dataKey="unfilteredPar"
            hide={true}
          />
          <YAxis type="category" dataKey="name" hide={true} />
          <Bar dataKey="filteredPar" stackId="a" fill={palettes.turquoise[5]} />
          <Bar
            dataKey="unfilteredPar"
            stackId="b"
            fill={palettes.turquoise[2]}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card>
      <CardHeader label="League Table" />
      <div className={styles["chart__wrapper"]}>
        <Table
          hoverRow={false}
          noWrap={true}
          color="primary"
          size={"sm"}
          sx={{
            padding: "0 1rem",
            width: "100%",
            color: palettes.grayscale[12],
          }}>
          <thead>
            <tr>
              <td>
                <b>Top Issuers</b>
              </td>
              <td style={{ width: "20%", textAlign: "right" }}>
                <b>{filterApplied && `Filter / `}Total ($Mn)</b>
              </td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {_.map(_.take(assembledData, 5), (lead: any) => {
              return (
                <tr key={lead.name}>
                  <td>{lead.name}</td>
                  <td style={{ textAlign: "right" }}>
                    {filterApplied
                      ? `${numberFormat(lead.filteredPar, "par-axis")} / `
                      : "NA / "}
                    {numberFormat(lead.unfilteredPar, "par-axis")}
                  </td>
                  <td>
                    <SparkLine
                      data={[lead]}
                      scale={assembledData[0].unfilteredPar}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

export default LeagueTable;
