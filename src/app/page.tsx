"use client";
import { useEffect, useState } from "react";
import _ from "lodash";
import { CssVarsProvider } from "@mui/joy/styles";

import { theme } from "@/utils/colorUtils";
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
import { Button, ButtonGroup, FormLabel } from "@mui/joy";
import MapCard from "./components/MapCard";
import CalendarTotals from "./components/CalendarTotals";
import LeagueTable from "./components/LeageTable";

export default function Home() {
  var filteredDealsInitialState = {
    byRating: new Array() as any[],
    bySector: new Array() as any[],
    byState: new Array() as any[],
    byTaxStatus: new Array() as any[],
    byIntersection: new Array() as any[],
  };

  const [viewMode, setViewMode] = useState("combo");
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
    <CssVarsProvider theme={theme}>
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
              <FilterSelect
                filter={filter}
                filterType="offeringType"
                handleFilterUpdate={handleFilterUpdate}
              />
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}>
                <FormLabel sx={{ margin: "0 .5rem" }}>View Mode</FormLabel>
                <ButtonGroup size={"sm"}>
                  <Button
                    variant={viewMode === "table" ? "solid" : undefined}
                    size={"sm"}
                    onClick={() => setViewMode("table")}>
                    Table
                  </Button>
                  <Button
                    variant={viewMode === "charts" ? "solid" : undefined}
                    size={"sm"}
                    onClick={() => setViewMode("charts")}>
                    Charts
                  </Button>
                  <Button
                    variant={viewMode === "combo" ? "solid" : undefined}
                    size={"sm"}
                    onClick={() => setViewMode("combo")}>
                    Both
                  </Button>
                </ButtonGroup>
              </div>
            </div>
            <div
              className={styles["body__nonscrolling-area"]}
              style={{
                flex: viewMode === "table" || viewMode === "combo" ? 3 : 0,
                minHeight:
                  viewMode === "table" || viewMode === "combo" ? "60vh" : "0vh",
              }}>
              <Row fr={2}>
                <Cell>
                  <DealTable
                    dealData={filteredDeals.byIntersection}
                    handleFilterUpdate={handleToggleFilterValue}
                    filter={filter}
                  />
                </Cell>
              </Row>
              <Row fr={1} maxHeight={"16rem"}>
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
              style={{
                flex: viewMode === "charts" || viewMode === "combo" ? 2 : 0,
              }}>
              <Column fr={1}>
                <Row fr={1}>
                  <Column fr={2}>
                    <Row fr={1} maxHeight={"16rem"}>
                      <Column fr={1}>
                        <Cell>
                          <CalendarTotals
                            unfilteredData={preparedDeals}
                            filteredData={filteredDeals.byIntersection}
                            filter={filter}
                            handleFilterUpdate={handleFilterUpdate}
                          />
                        </Cell>
                      </Column>
                      <Column fr={2}>
                        <Cell>
                          <LeagueTable
                            unfilteredData={preparedDeals}
                            filteredData={filteredDeals.byIntersection}
                            filter={filter}
                            handleFilterUpdate={handleFilterUpdate}
                          />
                        </Cell>
                      </Column>
                    </Row>
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
                <Row fr={1}>
                  <Cell>
                    <SectorCard
                      unfilteredData={preparedDeals}
                      filteredData={filteredDeals.byIntersection}
                      handleFilterUpdate={handleToggleFilterValue}
                      filter={filter}
                    />
                  </Cell>
                </Row>
              </Column>
            </div>
          </div>
        </div>
      </main>
    </CssVarsProvider>
  );
}
