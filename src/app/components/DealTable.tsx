import _ from "lodash";

import Card from "./Card";
import CardHeader from "./CardHeader";
import styles from "./DealTable.module.css";

interface tableProps {
  dealData: any;
  maturityData: any;
}

const DealTable = ({ dealData, maturityData }: tableProps) => {
  const columns = [
    "Date",
    "Issuer",
    "Issue Description",
    "Par ($M)",
    "State",
    "Tax Status",
  ];

  var gridTemplate = "";
  _.each(columns, () => {
    gridTemplate += "fit-content(100px) ";
  });

  return (
    <Card>
      <CardHeader label="Deal Table" />
      <div className={styles["table__wrapper"]}>
        <div
          className={styles["table"]}
          style={{
            display: "grid",
            gridTemplateColumns: gridTemplate,
            gridTemplateRows: `repeat(${maturityData.length}, 1fr)`,
            gridColumnGap: "0px",
            gridRowGap: "0px",
          }}>
          <div
            className={styles["table__header"]}
            style={{
              display: "grid",
              gridTemplateColumns: "subgrid",
              gridColumn: `1/${columns.length + 1}`,
            }}>
            {_.map(columns, (columnName: string, index: number) => {
              return (
                <div key={index} className={styles["table__cell--header"]}>
                  {columnName}
                </div>
              );
            })}
          </div>
          {_.map(maturityData, (maturity: any, index: number) => {
            return (
              <div
                key={index}
                className={styles["table__row"]}
                style={{
                  display: "grid",
                  gridTemplateColumns: "subgrid",
                  gridColumn: `1/${columns.length + 1}`,
                }}>
                {_.map(columns, (columnName: string, index: number) => {
                  return (
                    <div key={index} className={styles["table__cell--body"]}>
                      <span className={styles["table__text"]}>
                        {maturity[columnName]}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default DealTable;
