import Image from "next/image";

import dealData from "../data/deals.json";
import maturityData from "../data/maturities.json";
import Row from "./components/Row";
import Column from "./components/Column";
import Cell from "./components/Cell";
import Card from "./components/Card";
import styles from "./page.module.css";
import DealTable from "./components/DealTable";
import CategoryCard from "./components/CategoryCard";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.header} />
      <div className={styles.body}>
        <div className={styles.body__content}>
          <Column fr={1}>
            <Row fr={2}>
              <Cell>
                <DealTable dealData={dealData} maturityData={maturityData} />
              </Cell>
            </Row>
            <Row fr={1}>
              <Row fr={1}>
                <Column fr={1}>
                  <Cell>
                    <CategoryCard chartData={maturityData} />
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
    </main>
  );
}
