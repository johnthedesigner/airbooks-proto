import _ from "lodash";
import { Box, Button } from "@mui/joy";

import Card from "./Card";
import CardHeader from "./CardHeader";
import styles from "./DealTable.module.css";
import { singleValue } from "@/utils/dataUtils";

interface tableProps {
  dealData: any;
  handleFilterUpdate: Function;
  filter: any;
}

const DealTable = ({ dealData, handleFilterUpdate, filter }: tableProps) => {
  const columns = [
    "Date",
    "Issuer",
    "Issue Description",
    "Par ($M)",
    "State",
    "Tax Status",
    "Rating",
  ];

  const RatingButton = ({ label }: any) => {
    label = label === "Not Rated" ? "-" : label;
    console.log(label);
    return (
      <Button
        size={"sm"}
        sx={{
          width: "2.5rem",
          minHeight: ".75rem",
          padding: "0.25rem .25rem",
          fontSize: ".75rem",
          background: _.includes(filter.rating, label) ? "#b6d3ef" : "default",
        }}
        variant="soft"
        color="primary"
        onClick={() => handleFilterUpdate("rating", label)}>
        {label}
      </Button>
    );
  };

  var gridTemplate = "";
  _.times(columns.length, () => {
    gridTemplate += "fit-content(100px) ";
  });
  gridTemplate += "auto";

  return (
    <Card>
      <CardHeader label="Deal Table" />
      <div className={styles["table__wrapper"]}>
        <div
          className={styles["table"]}
          style={{
            display: "grid",
            gridTemplateColumns: gridTemplate,
            gridTemplateRows: `repeat(${
              dealData.length + 1
            }, fit-content(2rem))`,
            gridColumnGap: "0px",
            gridRowGap: "0px",
            padding: ".5rem",
          }}>
          <div
            className={styles["table__header"]}
            style={{
              display: "grid",
              gridTemplateColumns: "subgrid",
              gridColumn: `1/${columns.length + 2}`,
            }}>
            {_.map(columns, (columnName: string, index: number) => {
              return (
                <div key={index} className={styles["table__cell--header"]}>
                  <span className={styles["table__text"]}>{columnName}</span>
                </div>
              );
            })}
            <div className={styles["table__cell--header"]} />
          </div>
          {_.map(dealData, (deal: any, index: number) => {
            return (
              <div
                key={index}
                className={styles["table__row"]}
                style={{
                  display: "grid",
                  gridTemplateColumns: "subgrid",
                  gridColumn: `1/${columns.length + 2}`,
                  padding: ".25rem",
                }}>
                {_.map(columns, (columnName: string, index: number) => {
                  console.log("CHECK COLUMN NAME", columnName);
                  if (columnName === "Rating") {
                    // For ratings cluster
                    console.log("CHECK TABLE RATINGS", deal.moodysNormal);
                    return (
                      <div key={index} className={styles["table__cell--body"]}>
                        <Box sx={{ display: "flex", gap: "0.25rem" }}>
                          <RatingButton label={deal.moodysNormal} />
                          <RatingButton label={deal.spNormal} />
                          <RatingButton label={deal.fitchNormal} />
                          <RatingButton label={deal.krollNormal} />
                        </Box>
                      </div>
                    );
                  } else {
                    // For regular plain-text cell content
                    return (
                      <div key={index} className={styles["table__cell--body"]}>
                        <span className={styles["table__text"]}>
                          {singleValue(deal[columnName])}
                        </span>
                      </div>
                    );
                  }
                })}
                <div key={index} className={styles["table__cell--body"]} />
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default DealTable;
