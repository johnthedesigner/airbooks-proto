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
import Card from "./components/Card";
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
  const [filter, setFilter] = useState<filterStateInterface>(filterState);
  const [filteredMaturities, setFilteredMaturities] = useState(new Array());
  const [filteredDeals, setFilteredDeals] = useState(new Array());

  // map rating data into consistent categories
  let preparedDeals = mapRatings(maturityData);

  useEffect(() => {
    // Get freshly filtered deals and maturities when filter is updated
    const getFilteredData = async () => {
      let filteredData = await applyFilters(
        preparedDeals,
        maturityData,
        filter
      );
      setFilteredDeals(filteredData.deals);
      setFilteredMaturities(filteredData.maturities);
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
      <div className={styles.header} />
      <div className={styles.body}>
        <div className={styles["body__content"]}>
          <div className={styles["body__filter-bar"]}>
            <Button onClick={resetFilter}>Reset Filter</Button>
            <FilterSelect
              filter={filter}
              filterType="rating"
              // width={200}
              handleFilterUpdate={handleFilterUpdate}
            />
            <FilterSelect
              filter={filter}
              filterType="sector"
              // width={300}
              handleFilterUpdate={handleFilterUpdate}
            />
          </div>
          <div className={styles["body__nonscrolling-area"]}>
            <Cell>
              <DealTable
                dealData={filteredDeals}
                maturityData={filteredMaturities}
              />
            </Cell>
          </div>
          <div className={styles["body__scrolling-area"]}>
            <Column fr={1}>
              <Row fr={4}>
                <Column fr={3}>
                  <Row fr={1}>
                    <Cell>
                      <RatingsCard
                        chartData={dealData}
                        handleFilterUpdate={handleToggleFilterValue}
                        filter={filter}
                      />
                    </Cell>
                  </Row>
                  <Row fr={1}>
                    <Cell>
                      <SectorCard
                        chartData={dealData}
                        handleFilterUpdate={handleToggleFilterValue}
                        filter={filter}
                      />
                    </Cell>
                  </Row>
                </Column>
                <Column fr={1}>
                  <Row fr={1}>
                    <Cell>
                      <MapCard
                        chartData={filteredDeals}
                        handleFilterUpdate={handleToggleFilterValue}
                        filter={filter}
                      />
                    </Cell>
                  </Row>
                </Column>
              </Row>
              <Row fr={1}>
                <Cell>
                  <MaturityBreakdown chartData={filteredMaturities} />
                </Cell>
              </Row>
            </Column>
          </div>
        </div>
      </div>
    </main>
  );
}
