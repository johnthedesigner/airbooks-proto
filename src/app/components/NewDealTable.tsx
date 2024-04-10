import Table from "@mui/joy/Table";
import _ from "lodash";

import Card from "./Card";
import CardHeader from "./CardHeader";
import styles from "./NewDealTable.module.css";

interface dealTableInterface {
  dealData: any[];
}

const NewDealTable = ({ dealData }: dealTableInterface) => {
  const columns = [
    "Date",
    "Issuer",
    "Issue Description",
    "Par ($M)",
    "State",
    "Tax Status",
    "Rating",
  ];

  return (
    <Card>
      <CardHeader label="Deal Table" />
      <div className={styles["table__wrapper"]}>
        <Table hoverRow={true} className={styles["table"]}>
          <thead className={styles["table__header"]}>
            <tr>
              {_.map(columns, (column: string) => {
                return (
                  <td>
                    <span className={styles["table__text"]}>{column}</span>
                  </td>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {_.map(dealData, (deal: any) => {
              return (
                <tr>
                  {_.map(columns, (column: string) => {
                    return (
                      <td>
                        <span className={styles["table__text"]}>
                          {deal[column]}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

export default NewDealTable;
