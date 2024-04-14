"use client";
import { useEffect, useState } from "react";
import _ from "lodash";
import { CssVarsProvider } from "@mui/joy/styles";
import { Button, ButtonGroup, IconButton, FormLabel, Divider } from "@mui/joy";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";

import { theme } from "@/utils/colorUtils";
import { calendarData } from "@/utils/dataUtils";
// import dealData20240318 from "../data/deals-2024-3-18.json";
// import maturityData20240318 from "../data/maturities-2024-3-18.json";
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
import MapCard from "./components/MapCard";
import CalendarTotals from "./components/CalendarTotals";
import LeagueTable from "./components/LeageTable";
import WeekSelector from "./components/filter/WeekSelector";
import MaturitySelector from "./components/filter/MaturitySelector";

export default function Home() {
  var filteredDealsInitialState = {
    byRating: new Array() as any[],
    byMaturity: new Array() as any[],
    bySector: new Array() as any[],
    byState: new Array() as any[],
    byTaxStatus: new Array() as any[],
    byIntersection: new Array() as any[],
  };

  const [viewMode, setViewMode] = useState("combo");
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [filter, setFilter] = useState<filterStateInterface>(filterState);
  const [filteredMaturities, setFilteredMaturities] = useState(new Array());
  const [filteredDeals, setFilteredDeals] = useState(filteredDealsInitialState);
  const [unfilteredDeals, setUnfilteredDeals] = useState(new Array());
  const [unfilteredMaturities, setUnfilteredMaturities] = useState(new Array());
  const [filterApplied, setFilterApplied] = useState(false);

  useEffect(() => {
    // Get the right week's data
    const weekData = calendarData.weeks[selectedWeek];
    // Get freshly filtered deals and maturities when filter is updated
    const getFilteredData = async () => {
      let filteredData = await applyFilters(
        weekData.deals,
        weekData.maturities,
        filter
      );
      let {
        byRating,
        byMaturity,
        bySector,
        byState,
        byTaxStatus,
        byIntersection,
      } = filteredData.filteredDeals;
      setFilteredDeals({
        byRating,
        byMaturity,
        bySector,
        byState,
        byTaxStatus,
        byIntersection,
      });
      setFilteredMaturities(filteredData.filteredMaturities);
      setUnfilteredDeals(weekData.deals);
      setUnfilteredMaturities(weekData.maturities);
    };
    getFilteredData();
    // Record whether there is an active filter or not
    let newFilterApplied = false;
    _.each(filter, (valueArray: any) => {
      if (valueArray.length > 0) {
        newFilterApplied = true;
      }
    });
    setFilterApplied(newFilterApplied);
  }, [filter, selectedWeek]);

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
              <WeekSelector
                selectedWeek={selectedWeek}
                setSelectedWeek={setSelectedWeek}
                weeks={calendarData.weeks}
              />
              <Divider orientation="vertical" />
              <IconButton
                size={"sm"}
                disabled={!filterApplied}
                onClick={resetFilter}
                variant="solid"
                color="primary">
                <SyncRoundedIcon />
              </IconButton>
              <MaturitySelector
                filter={filter}
                unfilteredMaturities={unfilteredMaturities}
                filteredMaturities={filteredMaturities}
                handleFilterUpdate={handleFilterUpdate}
              />
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
              <Divider orientation="vertical" />
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}>
                <FormLabel sx={{ margin: "0 .5rem" }}>View Mode</FormLabel>
                <ButtonGroup size={"sm"} color="primary">
                  <Button
                    variant={viewMode === "table" ? "solid" : undefined}
                    color="primary"
                    size={"sm"}
                    onClick={() => setViewMode("table")}>
                    Table
                  </Button>
                  <Button
                    variant={viewMode === "charts" ? "solid" : undefined}
                    color="primary"
                    size={"sm"}
                    onClick={() => setViewMode("charts")}>
                    Charts
                  </Button>
                  <Button
                    variant={viewMode === "combo" ? "solid" : undefined}
                    color="primary"
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
                flex: viewMode === "table" || viewMode === "combo" ? 2 : 0,
                minHeight:
                  viewMode === "table" || viewMode === "combo" ? "40vh" : "0vh",
              }}>
              <Row fr={1}>
                <Cell>
                  <DealTable
                    dealData={filteredDeals.byIntersection}
                    handleFilterUpdate={handleToggleFilterValue}
                    filter={filter}
                  />
                </Cell>
              </Row>
            </div>
            <div
              className={styles["body__scrolling-area"]}
              style={{
                flex: viewMode === "charts" || viewMode === "combo" ? 3 : 0,
              }}>
              <Column fr={1}>
                <Row fr={1} maxHeight={"16rem"}>
                  <Cell>
                    <MaturityBreakdown
                      filter={filter}
                      unfilteredData={unfilteredMaturities}
                      filteredData={filteredMaturities}
                      handleFilterUpdate={handleToggleFilterValue}
                    />
                  </Cell>
                </Row>
                <Row fr={1}>
                  <Column fr={2}>
                    <Row fr={1} maxHeight={"16rem"}>
                      <Column fr={1}>
                        <Cell>
                          <CalendarTotals
                            unfilteredData={unfilteredDeals}
                            filteredData={filteredDeals.byIntersection}
                            filter={filter}
                            handleFilterUpdate={handleFilterUpdate}
                          />
                        </Cell>
                      </Column>
                      <Column fr={2}>
                        <Cell>
                          <LeagueTable
                            unfilteredData={unfilteredDeals}
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
                            unfilteredData={unfilteredDeals}
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
                        unfilteredData={unfilteredDeals}
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
                      unfilteredData={unfilteredDeals}
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
