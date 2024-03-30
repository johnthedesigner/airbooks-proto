"use client";
import { useEffect, useState } from "react";
import _ from "lodash";

import dealData from "../data/deals.json";
import maturityData from "../data/maturities.json";
import {
  applyMaturityFilters,
  prepareMaturities,
  updateFilter,
} from "@/utils/dataUtils";
import Row from "./components/Row";
import Column from "./components/Column";
import Cell from "./components/Cell";
import Card from "./components/Card";
import styles from "./page.module.css";
import DealTable from "./components/DealTable";
import CategoryCard from "./components/CategoryCard";
import MaturityBreakdown from "./components/MaturityBreakdown";

interface filterState {
  rating: any;
}

export default function Home() {
  let formattedMaturities = prepareMaturities(maturityData);
  const [filter, setFilter] = useState<filterState>({
    rating: [],
  });
  const [filteredMaturities, setFilteredMaturities] = useState(new Array());
  const [filteredDeals, setFilteredDeals] = useState(new Array());

  useEffect(() => {
    let maturityFilterOutput = applyMaturityFilters(
      formattedMaturities,
      filter
    );
    setFilteredMaturities(maturityFilterOutput);
  }, [filter]);

  const handleFilterUpdate = (key: string, value: any) => {
    setFilter(updateFilter(filter, key, value));
  };

  return (
    <main className={styles.main}>
      <div className={styles.header} />
      <div className={styles.body}>
        <div className={styles["body__content"]}>
          <div className={styles["body__nonscrolling-area"]}>
            <Cell>
              <DealTable
                dealData={dealData}
                maturityData={filteredMaturities}
              />
            </Cell>
          </div>
          <div className={styles["body__scrolling-area"]}>
            <Column fr={1}>
              <Row fr={1}>
                <Column fr={1}>
                  <Cell>
                    <CategoryCard
                      chartData={maturityData}
                      handleFilterUpdate={handleFilterUpdate}
                      filter={filter}
                    />
                  </Cell>
                </Column>
                <Column fr={1}>
                  <Cell>
                    <Card>
                      <p>Hello world.</p>
                    </Card>
                  </Cell>
                </Column>
              </Row>
              <Row fr={1}>
                <Column fr={1}>
                  <Cell>
                    <MaturityBreakdown chartData={filteredMaturities} />
                  </Cell>
                </Column>
              </Row>
              <Row fr={1}>
                <Cell>
                  <Card>
                    <p>Hello world.</p>
                  </Card>
                </Cell>
                <Cell>
                  <Card>
                    <p>Hello world.</p>
                  </Card>
                </Cell>
                <Cell>
                  <Card>
                    <p>Hello world.</p>
                  </Card>
                </Cell>
              </Row>
            </Column>
          </div>
        </div>
      </div>
    </main>
  );
}
