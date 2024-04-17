import _ from "lodash";
import { Box, Button } from "@mui/joy";
// import { List } from "react-virtualized";
import { Grid } from "react-virtualized";
// import type { ListRowProps } from "react-virtualized";
import type { GridCellProps } from "react-virtualized";

import Card from "./Card";
import CardHeader from "./CardHeader";
import styles from "./DealTable.module.css";
import { numberFormat, singleValue } from "@/utils/dataUtils";
import { palettes } from "@/utils/colorUtils";
import StructureSpark from "./StructureSpark";
import { useState } from "react";

interface tableProps {
  dealData: any;
  handleFilterUpdate: Function;
  filter: any;
}

const DealTable = ({ dealData, handleFilterUpdate, filter }: tableProps) => {
  const [hoveredRow, setHoveredRow] = useState(0);
  const columns = [
    { name: "Date", width: 90, headerAlign: "left" },
    { name: "Issue Description", width: 240, headerAlign: "left" },
    { name: "Par ($M)", width: 90, headerAlign: "right" },
    { name: "State", width: 90, headerAlign: "left" },
    { name: "Tax Status", width: 90, headerAlign: "left" },
    { name: "Offering Type", width: 100, headerAlign: "left" },
    { name: "Rating", width: 230, headerAlign: "left" },
    { name: "Structure", width: 200, headerAlign: "left" },
    { name: "Sector", width: 120, headerAlign: "left" },
    { name: "Lead Manager", width: 200, headerAlign: "left" },
    { name: "Source of Repayment", width: 200, headerAlign: "left" },
  ];

  var tableWidth = 0;
  _.each(columns, (column: any) => {
    tableWidth += column.width;
  });

  // interface rowRendererInterface {
  //   columnIndex: number;
  //   isScrolling: boolean;
  //   isVisible: boolean;
  //   key: string;
  //   // parent: React.Component<GridCoreProps> & MeasuredCellParent;
  //   index: number;
  //   style: React.CSSProperties;
  // }

  interface cellWrapperProps {
    children: any;
    rowIndex: number;
    columnIndex: number;
    style: any;
    isHovered: Boolean;
  }

  const CellWrapper = ({
    children,
    rowIndex,
    columnIndex,
    style,
    isHovered,
  }: cellWrapperProps) => {
    return (
      <div
        // key={key}
        className={styles["table__cell--body"]}
        onMouseEnter={() => {
          setHoveredRow(rowIndex);
        }}
        onMouseLeave={() => {
          setHoveredRow(0);
        }}
        style={{
          ...style,
          // width: "fit-content",
          width: columns[columnIndex].width,
          minWidth: columns[columnIndex].width,
          background: isHovered ? palettes.grayscale[0] : "white",
        }}>
        {children}
      </div>
    );
  };

  const cellRenderer = ({
    columnIndex,
    key,
    rowIndex,
    style,
  }: GridCellProps) => {
    let columnName = columns[columnIndex].name;
    let deal = dealData[rowIndex];
    let isHovered = rowIndex === hoveredRow;
    // return (
    //   <div key={key} style={style}>
    //     {list[rowIndex][columnIndex]}
    //   </div>
    // );
    if (rowIndex === 0 && false) {
      // Render header cells
      return (
        <div
          key={columnName}
          className={styles["table__cell--header"]}
          style={{
            ...style,
            // width: "fit-content",
            width: columns[columnIndex].width,
            // position: "sticky",
            // top: 0,
          }}>
          <span className={styles["table__text"]}>{columnName}</span>
        </div>
      );
    } else {
      if (columnName === "Rating") {
        // For ratings cluster
        return (
          <CellWrapper
            key={key}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            style={style}
            isHovered={isHovered}>
            <Box sx={{ display: "flex", gap: "0.25rem" }}>
              <RatingButton label={deal.moodysNormal} />
              <RatingButton label={deal.spNormal} />
              <RatingButton label={deal.fitchNormal} />
              <RatingButton label={deal.krollNormal} />
            </Box>
          </CellWrapper>
        );
      } else if (columnName === "Par ($M)") {
        // For regular par amount column
        return (
          <CellWrapper
            key={key}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            style={{ ...style, justifyContent: "flex-end" }}
            isHovered={isHovered}>
            <span
              className={styles["table__text"]}
              style={{ alignItems: "flex-end" }}>
              {numberFormat(Number(singleValue(deal[columnName])), "par-table")}
            </span>
          </CellWrapper>
        );
      } else if (columnName === "Structure") {
        // For structure spark tables
        return (
          <CellWrapper
            key={key}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            style={style}
            isHovered={isHovered}>
            <StructureSpark deal={deal} filter={filter} />
          </CellWrapper>
        );
      } else {
        // For regular plain-text cell content
        return (
          <CellWrapper
            key={key}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            style={style}
            isHovered={isHovered}>
            <span className={styles["table__text"]}>
              {singleValue(deal[columnName])}
            </span>
          </CellWrapper>
        );
      }
    }
  };

  // const RowRenderer = ({
  //   index, // Index of row
  //   isScrolling, // The List is currently being scrolled
  //   isVisible, // This row is visible within the List (eg it is not an overscanned row)
  //   key, // Unique key within array of rendered rows
  //   parent, // Reference to the parent List (instance)
  //   style, // Style object to be applied to row (to position it);
  // }: // This must be passed through to the rendered row element.
  // ListRowProps) => {
  //   let deal = dealData[index];
  //   return (
  //     <div
  //       key={deal.Index}
  //       className={styles["table__row"]}
  //       style={{
  //         display: "grid",
  //         gridTemplateColumns: "subgrid",
  //         gridColumn: `1/${columns.length + 2}`,
  //         padding: ".25rem",
  //       }}>
  //       {_.map(columns, (columnName: string) => {
  //         if (columnName === "Rating") {
  //           // For ratings cluster
  //           return (
  //             <div key={columnName} className={styles["table__cell--body"]}>
  //               <Box sx={{ display: "flex", gap: "0.25rem" }}>
  //                 <RatingButton label={deal.moodysNormal} />
  //                 <RatingButton label={deal.spNormal} />
  //                 <RatingButton label={deal.fitchNormal} />
  //                 <RatingButton label={deal.krollNormal} />
  //               </Box>
  //             </div>
  //           );
  //         } else if (columnName === "Par ($M)") {
  //           // For regular par amount column
  //           return (
  //             <div
  //               key={columnName}
  //               className={styles["table__cell--body"]}
  //               style={{ justifyContent: "flex-end" }}>
  //               <span className={styles["table__text"]}>
  //                 {numberFormat(
  //                   Number(singleValue(deal[columnName])),
  //                   "par-table"
  //                 )}
  //               </span>
  //             </div>
  //           );
  //         } else if (columnName === "Structure") {
  //           // For structure spark tables
  //           return (
  //             <div
  //               key={columnName}
  //               className={styles["table__cell--body"]}
  //               style={{ justifyContent: "flex-end" }}>
  //               <StructureSpark deal={deal} filter={filter} />
  //             </div>
  //           );
  //         } else {
  //           // For regular plain-text cell content
  //           return (
  //             <div key={columnName} className={styles["table__cell--body"]}>
  //               <span className={styles["table__text"]}>
  //                 {singleValue(deal[columnName])}
  //               </span>
  //             </div>
  //           );
  //         }
  //       })}
  //       <div className={styles["table__cell--body"]} />
  //     </div>
  //   );
  // };

  const RatingButton = ({ label }: any) => {
    label = label === "Not Rated" ? "-" : label;
    return (
      <Button
        size={"sm"}
        sx={{
          width: "2.5rem",
          minHeight: ".75rem",
          padding: "0.25rem .25rem",
          fontSize: ".75rem",
          color:
            label === "-"
              ? palettes.blue[10]
              : `${palettes.blue[10]}!important`,
          background:
            label != "-"
              ? _.includes(filter.rating, label)
                ? palettes.blue[3]
                : palettes.blue[1]
              : `${palettes.grayscale[0]}!important`,
        }}
        variant="soft"
        // color="primary"
        disabled={label === "-"}
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
      {/* <div className={styles["table__wrapper"]}> */}
      {/* <div
          className={styles["table"]}
          style={{
            display: "grid",
            gridTemplateColumns: gridTemplate,
            gridTemplateRows: `repeat(${
              dealData.length + 1
            }, fit-content(2rem))`,
            gridColumnGap: "0px",
            gridRowGap: "0px",
            padding: "0 .5rem .5rem",
          }}> */}
      {/* <div
            className={styles["table__header"]}
            style={{
              display: "grid",
              gridTemplateColumns: "subgrid",
              gridColumn: `1/${columns.length + 2}`,
            }}>
            {_.map(columns, (columnName: string) => {
              return (
                <div key={columnName} className={styles["table__cell--header"]}>
                  <span className={styles["table__text"]}>{columnName}</span>
                </div>
              );
            })}
            <div className={styles["table__cell--header"]} />
          </div> */}
      {/* <List
            width={300}
            height={300}
            rowCount={dealData.length}
            rowHeight={20}
            rowRenderer={RowRenderer}
          /> */}
      <div
        style={{
          flex: 1,
          maxWidth: "100%",
          overflow: "auto",
          position: "relative",
        }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
          }}>
          <div
            className={styles["table__header"]}
            style={{ width: tableWidth }}>
            {_.map(columns, (column: any) => {
              return (
                <div
                  key={column.name}
                  className={styles["table__cell--header"]}
                  style={{
                    width: column.width,
                    textAlign: column.headerAlign,
                    // position: "sticky",
                    // top: 0,
                  }}>
                  <span className={styles["table__text"]}>{column.name}</span>
                </div>
              );
            })}
          </div>
          <Grid
            // autoContainerWidth={true}
            // autoWidth={true}
            // autoHeight={true}
            cellRenderer={cellRenderer}
            columnCount={columns.length}
            columnWidth={(c: any) => {
              // Set column width by column type
              return columns[c.index].width;
            }}
            height={1000}
            rowCount={dealData.length}
            overscanRowCount={5}
            rowHeight={30}
            width={tableWidth}
            style={{
              width: tableWidth,
              flex: 1,
            }}
          />
        </div>
      </div>
      {/* </div> */}
    </Card>
  );
};

export default DealTable;
