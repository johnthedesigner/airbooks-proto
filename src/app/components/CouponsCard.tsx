"use client";

import _ from "lodash";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import Card from "./Card";
import CardHeader from "./CardHeader";
import styles from "./RatingsCard.module.css";
import { numberFormat } from "@/utils/dataUtils";
import { palettes } from "@/utils/colorUtils";
import { useEffect, useState } from "react";
import { type } from "os";

interface chartProps {
  unfilteredData: any;
  filteredData: any;
  deals: any;
  handleFilterUpdate: Function;
  filter: any;
}

const CouponsCard = ({
  unfilteredData,
  filteredData,
  deals,
  handleFilterUpdate,
  filter,
}: chartProps) => {
  // Coupon categories
  const [unfilteredCouponData, setUnfilteredCouponData] = useState(new Array());
  const [filteredCouponData, setFilteredCouponData] = useState(new Array());
  const [assembledData, setAssembledData] = useState(new Array());
  // Get object of coupon values with corresponding par totals
  const getParByCoupon = (maturityData: any[]) => {
    let cleanedMaturityData = _.filter(maturityData, (maturity: any) => {
      return maturity["Coupon"] != "-";
    });
    let parTotals = _.reduce(
      cleanedMaturityData,
      (result: any, maturity: any) => {
        // Make sure we have a result object and property to start with
        result || (result = {});
        // Get coupon and par data
        let couponValue = maturity["Coupon"];
        if (typeof couponValue === "string") {
          couponValue = couponValue.split(",")[0];
        }
        let couponString = `${couponValue}`;
        let couponFloor = Math.floor(couponValue);
        let couponFloorString = `${couponFloor}`;
        let par = Number(maturity["Filtered Par"]);
        let previousStep = result[couponFloorString] || {
          totalPar: 0,
          couponFloor: couponFloorString,
          couponArray: new Array(),
        };
        let previousPar = previousStep[couponString] || 0;
        let previousCouponArray = previousStep.couponArray || new Array();
        let updatedPar = previousPar + par;
        if (!result[couponFloorString])
          result[couponFloorString] = {
            totalPar: 0,
            couponFloor: couponFloorString,
            couponArray: new Array(),
          };
        // Add up the par amounts to get a total by by coupon and rounded coupon value
        result[couponFloorString] = {
          ...result[couponFloorString],
          totalPar: result[couponFloorString].totalPar + par,
          [couponString]: Number(updatedPar),
          couponArray: _.uniq([...previousCouponArray, couponString]),
        };
        return result;
      },
      {}
    );
    console.log("PAR TOTALS", parTotals);
    let assembledData = _.map(parTotals, (couponItem: string) => {
      return couponItem;
    });
    console.log("ASSEMBLED", assembledData);
    return assembledData;
  };

  const assembleData = (unfilteredParTotals: any, filteredParTotals: any) => {
    return _.map(unfilteredParTotals, (unfilteredItem: any, key: number) => {
      let filteredItem = filteredParTotals[key] || {
        totalPar: 0,
      };
      return {
        ...unfilteredItem,
        parDelta: unfilteredItem.totalPar - filteredItem.totalPar,
        filteredPar: filteredItem.totalPar,
      };
    });
  };

  useEffect(() => {
    let unfilteredMaturities = unfilteredData || new Array();
    let filteredMaturities = filteredData || new Array();
    let unfilteredCouponDataUpdated = getParByCoupon(unfilteredMaturities);
    let filteredCouponDataUpdated = getParByCoupon(filteredMaturities);
    let assembledDataUpdated = assembleData(
      unfilteredCouponDataUpdated,
      filteredCouponDataUpdated
    );
    setUnfilteredCouponData(unfilteredCouponDataUpdated);
    setFilteredCouponData(filteredCouponDataUpdated);
    setAssembledData(assembledDataUpdated);
  }, [unfilteredData, filteredData]);

  const handleClick = (data: any) => {
    handleFilterUpdate("coupon", data.couponFloor);
  };

  return (
    <Card>
      <CardHeader label="Total Par by Rating ($Mn)" />
      <div className={styles["chart__wrapper"]}>
        <ResponsiveContainer
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
            <XAxis
              type="category"
              stroke={palettes.grayscale[6]}
              dataKey="couponFloor"
            />
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
              dataKey="filteredPar"
              stackId="a"
              fill={palettes.magenta[5]}
              onClick={handleClick}>
              {assembledData.map((entry, index) => {
                return (
                  <Cell
                    cursor="pointer"
                    fill={
                      _.includes(filter.sector, entry.couponFloor)
                        ? palettes.magenta[5]
                        : palettes.magenta[4]
                    }
                    key={`cell-${index}`}
                  />
                );
              })}
            </Bar>
            <Bar
              name="Not in current filter"
              dataKey="parDelta"
              stackId="a"
              fill={palettes.grayscale[5]}
              onClick={handleClick}>
              {assembledData.map((entry, index) => {
                return (
                  <Cell
                    cursor="pointer"
                    fill={
                      _.includes(filter.sector, entry.couponFloor)
                        ? palettes.grayscale[3]
                        : palettes.grayscale[2]
                    }
                    key={`cell-${index}`}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default CouponsCard;
