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

interface chartProps {
  unfilteredData: any;
  filteredData: any;
  handleFilterUpdate: Function;
  filter: any;
}

const CalendarTotals = ({
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

  const getParTotals = (data: any, key?: string, values?: string[]) => {
    // Sum par amount by key and value
    var parTotals = 0;
    _.each(data, (deal: any, index: number) => {
      // If no key is provided, use all deals
      if (key === undefined) {
        // Get current par
        let individualPar = Number(deal["Par ($M)"]);
        // Add to running total
        parTotals += individualPar;
      } else if (_.includes(values, deal[key])) {
        // Or else, if this is the right kind of deal, add par to sum
        // Get current par
        let individualPar = Number(deal["Par ($M)"]);
        // Add to running total
        parTotals += individualPar;
      }
    });
    return parTotals;
  };

  let TotalParUnfiltered = getParTotals(unfilteredData);
  let TotalParFiltered = getParTotals(filteredData);
  let NegotiatedParUnfiltered = getParTotals(unfilteredData, "Offering Type", [
    "Negotiated",
  ]);
  let NegotiatedParFiltered = getParTotals(filteredData, "Offering Type", [
    "Negotiated",
  ]);
  let CompetitiveParUnfiltered = getParTotals(unfilteredData, "Offering Type", [
    "Competitive",
  ]);
  let CompetitiveParFiltered = getParTotals(filteredData, "Offering Type", [
    "Competitive",
  ]);
  let TaxableParUnfiltered = getParTotals(unfilteredData, "Tax Status", [
    "Tax",
    "AMT",
  ]);
  let TaxableParFiltered = getParTotals(filteredData, "Tax Status", [
    "Tax",
    "AMT",
  ]);
  let ExemptParUnfiltered = getParTotals(unfilteredData, "Tax Status", ["T-E"]);
  let ExemptParFiltered = getParTotals(filteredData, "Tax Status", ["T-E"]);

  const assembleData = (
    name: string,
    unfilteredValue: number,
    filteredValue: number
  ) => {
    return [
      {
        name,
        filteredValue,
        unfilteredValue: unfilteredValue - filteredValue,
      },
    ];
  };

  let negotiatedData = assembleData(
    "Negotiated",
    NegotiatedParUnfiltered,
    NegotiatedParFiltered
  );
  let competitiveData = assembleData(
    "Competitive",
    CompetitiveParUnfiltered,
    CompetitiveParFiltered
  );
  let taxableData = assembleData(
    "Taxable",
    TaxableParUnfiltered,
    TaxableParFiltered
  );
  let exemptData = assembleData(
    "Tax Exempt",
    ExemptParUnfiltered,
    ExemptParFiltered
  );
  let totalData = assembleData("Total", TotalParUnfiltered, TotalParFiltered);

  const handleClick = (data: any, index: number) => {
    handleFilterUpdate("rating", data.name);
  };

  const SparkLine = ({ data }: any) => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={50}
          height={10}
          layout="vertical"
          syncId="calendarTotalsChart"
          data={data}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}>
          <XAxis
            type="number"
            domain={[0, TotalParUnfiltered * 1.1]}
            dataKey="unfilteredValue"
            hide={true}
          />
          <YAxis type="category" dataKey="name" hide={true} />
          <Tooltip />
          <Bar dataKey="filteredValue" stackId="a" fill="#8884d8" />
          <Bar dataKey="unfilteredValue" stackId="a" fill="#DDDDDD" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card>
      <CardHeader label="Calendar Totals" />
      <div className={styles["chart__wrapper"]}>
        <Table
          hoverRow={true}
          noWrap={true}
          size={"sm"}
          sx={{ padding: "0 1rem", width: "100%" }}>
          <thead>
            <tr>
              <td style={{ width: "30%" }}></td>
              <td colSpan={2} style={{ width: "70%", textAlign: "left" }}>
                <b>{filterApplied && `Filtered / `}Total ($Mn)</b>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr
              onClick={() => {
                handleFilterUpdate("offeringType", ["Negotiated"]);
              }}>
              <td>
                <b>Negotiated</b>
              </td>
              <td style={{ textAlign: "right" }}>
                {filterApplied
                  ? `${numberFormat(NegotiatedParFiltered, "par-axis")} / `
                  : "NA / "}
                {numberFormat(NegotiatedParUnfiltered, "par-axis")}
              </td>
              <td>
                <SparkLine data={negotiatedData} />
              </td>
            </tr>
            <tr
              onClick={() => {
                handleFilterUpdate("offeringType", ["Competitive"]);
              }}>
              <td>
                <b>Competitive</b>
              </td>
              <td style={{ textAlign: "right" }}>
                {filterApplied
                  ? `${numberFormat(CompetitiveParFiltered, "par-axis")} / `
                  : "NA / "}
                {numberFormat(CompetitiveParUnfiltered, "par-axis")}
              </td>
              <td>
                <SparkLine data={competitiveData} />
              </td>
            </tr>
            <tr
              onClick={() => {
                handleFilterUpdate("taxStatus", ["T-E"]);
              }}>
              <td>
                <b>Tax-Exempt</b>
              </td>
              <td style={{ textAlign: "right" }}>
                {filterApplied
                  ? `${numberFormat(ExemptParFiltered, "par-axis")} / `
                  : "NA / "}
                {numberFormat(ExemptParUnfiltered, "par-axis")}
              </td>
              <td>
                <SparkLine data={exemptData} />
              </td>
            </tr>
            <tr
              onClick={() => {
                handleFilterUpdate("taxStatus", ["Tax", "AMT"]);
              }}>
              <td>
                <b>Taxable</b>
              </td>
              <td style={{ textAlign: "right" }}>
                {filterApplied
                  ? `${numberFormat(TaxableParFiltered, "par-axis")} / `
                  : "NA / "}
                {numberFormat(TaxableParUnfiltered, "par-axis")}
              </td>
              <td>
                <SparkLine data={taxableData} />
              </td>
            </tr>
            <tr>
              <td>
                <b>Total Calendar</b>
              </td>
              <td style={{ textAlign: "right" }}>
                <b>
                  {filterApplied
                    ? `${numberFormat(TotalParFiltered, "par-axis")} / `
                    : "NA / "}
                  {numberFormat(TotalParUnfiltered, "par-axis")}
                </b>
              </td>
              <td>
                <SparkLine data={totalData} />
              </td>
              <td></td>
            </tr>
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

export default CalendarTotals;
