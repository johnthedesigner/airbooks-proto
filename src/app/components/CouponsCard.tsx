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
  filter: any;
}

const CouponsCard = ({ unfilteredData, filteredData, filter }: chartProps) => {
  // Coupon categories
  const [unfilteredCouponData, setUnfilteredCouponData] = useState(new Array());
  const [filteredCouponData, setFilteredCouponData] = useState(new Array());
  // Get object of coupon values with corresponding par totals
  const getParByCoupon = (maturityData: any[]) => {
    let filteredMaturityData = _.filter(maturityData, (maturity: any) => {
      return maturity["Coupon"] != "-";
    });
    let parTotals = _.reduce(
      filteredMaturityData,
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
    let couponValues = _.keys(parTotals);
    let assembledData = _.map(parTotals, (couponItem: string) => {
      return couponItem;
    });
    // console.log(assembledData);
    return assembledData;
  };

  useEffect(() => {
    let unfilteredMaturities = unfilteredData || new Array();
    let filteredMaturities = filteredData || new Array();
    let unfilteredCouponDataUpdated = getParByCoupon(unfilteredMaturities);
    let filteredCouponDataUpdated = getParByCoupon(filteredMaturities);
    setUnfilteredCouponData(unfilteredCouponDataUpdated);
    setFilteredCouponData(filteredCouponDataUpdated);
  }, [unfilteredData, filteredData]);

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
            data={unfilteredCouponData}
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
              dataKey="totalPar"
              stackId="a"
              fill={palettes.magenta[3]}
            />
            {/* {_.map(unfilteredCouponData, (couponItem: any) => {
              return _.map(
                couponItem.couponArray,
                (couponString: string, index: number) => {
                  return (
                    <Bar
                      key={index}
                      dataKey={couponString}
                      stackId={"a"}
                      fill="#8884d8"
                    />
                  );
                }
              );
            })} */}
            {/* <Bar dataKey="Fitch" stackId="a" fill="#8884d8" />
            <Bar dataKey="Kroll" stackId="a" fill="#82ca9d" />
            <Bar dataKey="Moody's" stackId="a" fill="#FFBB28" />
            <Bar dataKey="Standard & Poor's" stackId="a" fill="#FF8042" /> */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default CouponsCard;
