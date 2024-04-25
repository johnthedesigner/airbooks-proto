import _ from "lodash";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { Box, Chip, FormControl, FormLabel, IconButton } from "@mui/joy";

import { filterList } from "@/utils/filterUtils";
import { CloseRounded } from "@mui/icons-material";
import { useEffect, useState } from "react";

interface filterProps {
  filter: any;
  unfilteredMaturities: any;
  filteredMaturities: any;
  width?: number;
  handleFilterUpdate: Function;
}

const MaturitySelector = ({
  filter,
  unfilteredMaturities,
  filteredMaturities,
  width,
  handleFilterUpdate,
}: filterProps) => {
  const [maturityOptions, setMaturityOptions] = useState(new Array());

  useEffect(() => {
    // Remove maturities with no year in the Structure field
    let filteredMaturities = _.filter(unfilteredMaturities, (maturity: any) => {
      return maturity.Structure != "-";
    });
    // Make an ordered list of unique values from the structure fields
    let maturityArray = _.uniq(
      _.map(filteredMaturities, (maturity: any) => {
        if (maturity.Structure != "-") {
          return `${maturity.Structure}`;
        } else {
          return false;
        }
      })
    ).sort();
    setMaturityOptions(maturityArray);
  }, [unfilteredMaturities]);

  const handleChange = (e: any, value: any) => {
    e.persist();
    handleFilterUpdate("maturities", value);
  };

  return (
    <>
      {/* {filter[filterType].length > 0 && ( */}
      {true && (
        <FormControl sx={{ width }}>
          <FormLabel>{filterList.maturities.label}</FormLabel>
          <Select
            multiple
            // defaultValue={[]}
            color="primary"
            value={filter.maturities}
            size={"sm"}
            placeholder={`Filter by ${filterList.maturities.label}`}
            onChange={handleChange}
            endDecorator={
              filter.maturities.length > 0 && (
                <IconButton
                  onClick={(e) => {
                    handleChange(e, []);
                  }}>
                  <CloseRounded />
                </IconButton>
              )
            }
            renderValue={(selected: any) => (
              <Box sx={{ display: "flex", gap: "0.25rem" }}>
                {selected.map((selectedOption: any, index: number) => (
                  <Chip key={index} color="primary">
                    {selectedOption.label}
                  </Chip>
                ))}
              </Box>
            )}
            sx={{
              minWidth: "10rem",
              maxWidth: "20rem",
            }}
            slotProps={{
              listbox: {
                sx: {
                  width: "100%",
                },
              },
            }}>
            {_.map(maturityOptions, (maturityValue: any, index: number) => {
              return (
                <Option key={index} value={maturityValue}>
                  {maturityValue}
                </Option>
              );
            })}
          </Select>
        </FormControl>
      )}
    </>
  );
};

export default MaturitySelector;
