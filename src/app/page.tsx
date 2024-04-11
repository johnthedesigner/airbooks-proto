"use client";
import { useEffect, useState } from "react";
import _ from "lodash";

import dealData from "../data/deals.json";
import maturityData from "../data/maturities.json";
import {
  applyFilters,
  updateFilter,
  substituteFilter,
  filterList,
  filterState,
  filterStateInterface,
  filterItemInterface,
} from "@/utils/filterUtils";
import Row from "./components/Row";
import Column from "./components/Column";
import Cell from "./components/Cell";
import styles from "./page.module.css";
import DealTable from "./components/DealTable";
import RatingsCard from "./components/RatingsCard";
import SectorCard from "./components/SectorCard";
import MaturityBreakdown from "./components/MaturityBreakdown";
import { mapRatings } from "@/utils/ratingUtils";
import FilterSelect from "./components/filter/FilterSelect";
import { Button } from "@mui/joy";
import MapCard from "./components/MapCard";

export default function Home() {
  var filteredDealsInitialState = {
    byRating: new Array() as any[],
    bySector: new Array() as any[],
    byState: new Array() as any[],
    byTaxStatus: new Array() as any[],
    byIntersection: new Array() as any[],
  };

  const [showCharts, setShowCharts] = useState(true);
  const [filter, setFilter] = useState<filterStateInterface>(filterState);
  const [filteredMaturities, setFilteredMaturities] = useState(new Array());
  const [filteredDeals, setFilteredDeals] = useState(filteredDealsInitialState);

  // map rating data into consistent categories
  let preparedDeals = mapRatings(dealData);

  useEffect(() => {
    // Get freshly filtered deals and maturities when filter is updated
    const getFilteredData = async () => {
      let filteredData = await applyFilters(
        preparedDeals,
        maturityData,
        filter
      );
      let { byRating, bySector, byState, byTaxStatus, byIntersection } =
        filteredData.filteredDeals;
      setFilteredDeals({
        byRating,
        bySector,
        byState,
        byTaxStatus,
        byIntersection,
      });
      setFilteredMaturities(filteredData.filteredMaturities);
    };
    getFilteredData();
  }, [filter]);

  const handleFilterUpdate = (key: string, value: any) => {
    setFilter(substituteFilter(filter, key, value));
  };

  const handleToggleFilterValue = (key: string, value: any) => {
    setFilter(updateFilter(filter, key, value));
  };

  const resetFilter = () => {
    setFilter(filterState);
  };

  return (
    <main className={styles.main}>
      <div className={styles.body}>
        <div className={styles["body__content"]}>
          <div className={styles["body__filter-bar"]}>
            <Button size={"sm"} onClick={resetFilter}>
              Reset Filter
            </Button>
            <FilterSelect
              filter={filter}
              filterType="rating"
              handleFilterUpdate={handleFilterUpdate}
            />
            <FilterSelect
              filter={filter}
              filterType="sector"
              handleFilterUpdate={handleFilterUpdate}
            />
            <FilterSelect
              filter={filter}
              filterType="state"
              handleFilterUpdate={handleFilterUpdate}
            />
            <FilterSelect
              filter={filter}
              filterType="taxStatus"
              handleFilterUpdate={handleFilterUpdate}
            />
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}>
              <Button size={"sm"} onClick={() => setShowCharts(!showCharts)}>
                {showCharts ? "Hide Charts" : "Show Charts"}
              </Button>
            </div>
          </div>
          <div className={styles["body__nonscrolling-area"]}>
            <Row fr={2}>
              <Cell>
                <DealTable
                  dealData={filteredDeals.byIntersection}
                  handleFilterUpdate={handleToggleFilterValue}
                  filter={filter}
                />
              </Cell>
            </Row>
            <Row fr={1} maxHeight={"12rem"}>
              <Cell>
                <MaturityBreakdown
                  unfilteredData={maturityData}
                  filteredData={filteredMaturities}
                />
              </Cell>
            </Row>
          </div>
          <div
            className={styles["body__scrolling-area"]}
            style={{ flex: showCharts ? 2 : 0 }}>
            <Column fr={1}>
              <Row fr={1}>
                <Column fr={2}>
                  <Row fr={1}>
                    <Column fr={1}>
                      <Cell>
                        <RatingsCard
                          unfilteredData={preparedDeals}
                          filteredData={filteredDeals.byIntersection}
                          handleFilterUpdate={handleToggleFilterValue}
                          filter={filter}
                        />
                      </Cell>
                    </Column>
                  </Row>
                  <Row fr={1}>
                    <Column fr={1}>
                      <Cell>
                        <SectorCard
                          unfilteredData={preparedDeals}
                          filteredData={filteredDeals.byIntersection}
                          handleFilterUpdate={handleToggleFilterValue}
                          filter={filter}
                        />
                      </Cell>
                    </Column>
                  </Row>
                </Column>
                <Column fr={1}>
                  <Cell>
                    <MapCard
                      unfilteredData={preparedDeals}
                      filteredData={filteredDeals.byIntersection}
                      handleFilterUpdate={handleToggleFilterValue}
                      filter={filter}
                    />
                  </Cell>
                </Column>
              </Row>
            </Column>
          </div>
        </div>
      </div>
    </main>
  );
}
