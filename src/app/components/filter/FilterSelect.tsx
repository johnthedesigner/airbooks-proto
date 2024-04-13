import _ from "lodash";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { Box, Chip, FormControl, FormLabel, IconButton } from "@mui/joy";

import { filterList } from "@/utils/filterUtils";
import { CloseRounded } from "@mui/icons-material";

interface filterProps {
  filter: any;
  filterType: string;
  width?: number;
  handleFilterUpdate: Function;
}

const FilterSelect = ({
  filter,
  filterType,
  width,
  handleFilterUpdate,
}: filterProps) => {
  const handleChange = (e: any, value: any) => {
    e.persist();
    handleFilterUpdate(filterType, value);
  };

  return (
    <>
      {/* {filter[filterType].length > 0 && ( */}
      {true && (
        <FormControl sx={{ width }}>
          <FormLabel>{filterList[filterType].label}</FormLabel>
          <Select
            multiple
            // defaultValue={[]}
            value={filter[filterType]}
            size={"sm"}
            placeholder={`Filter by ${filterList[filterType].label}`}
            onChange={handleChange}
            endDecorator={
              filter[filterType].length > 0 && (
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
              filterList[filterType].options,
              (option: any, index: number) => {
                return (
                  <Option key={index} value={option.value}>
                    {option.label}
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

export default FilterSelect;
