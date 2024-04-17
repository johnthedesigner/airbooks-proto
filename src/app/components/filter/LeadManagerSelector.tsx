import _ from "lodash";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { Box, Chip, FormControl, FormLabel, IconButton } from "@mui/joy";

import { filterList } from "@/utils/filterUtils";
import { CloseRounded } from "@mui/icons-material";
import { useEffect, useState } from "react";

interface filterProps {
  filter: any;
  unfilteredDeals: any;
  width?: number;
  handleFilterUpdate: Function;
}

const LeadManagerSelector = ({
  filter,
  unfilteredDeals,
  width,
  handleFilterUpdate,
}: filterProps) => {
  const [leadManagerOptions, setLeadManagerOptions] = useState(new Array());

  useEffect(() => {
    // Remove maturities with no year in the Structure field
    let filteredDeals = _.filter(unfilteredDeals, (deal: any) => {
      return deal["Lead Manager"] != "-";
    });
    // Make an ordered list of unique values from the structure fields
    let leadManagerArray = _.uniq(
      _.map(filteredDeals, (deal: any) => {
        if (deal["Lead Manager"] != "-") {
          return `${deal["Lead Manager"]}`;
        } else {
          return false;
        }
      })
    ).sort();
    setLeadManagerOptions(leadManagerArray);
  }, [unfilteredDeals]);

  const handleChange = (e: any, value: any) => {
    e.persist();
    handleFilterUpdate("leadManager", value);
  };

  return (
    <>
      {/* {filter[filterType].length > 0 && ( */}
      {true && (
        <FormControl sx={{ width }}>
          <FormLabel>{filterList.leadManager.label}</FormLabel>
          <Select
            multiple
            // defaultValue={[]}
            value={filter.leadManager}
            size={"sm"}
            placeholder={`Filter by ${filterList.leadManager.label}`}
            onChange={handleChange}
            endDecorator={
              filter.leadManager.length > 0 && (
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
            {_.map(
              leadManagerOptions,
              (leadManagerValue: any, index: number) => {
                return (
                  <Option key={index} value={leadManagerValue}>
                    {leadManagerValue}
                  </Option>
                );
              }
            )}
          </Select>
        </FormControl>
      )}
    </>
  );
};

export default LeadManagerSelector;
