import _ from "lodash";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { Box, Chip, FormControl, FormLabel, IconButton } from "@mui/joy";

import { filterList } from "@/utils/filterUtils";
import { CloseRounded } from "@mui/icons-material";

interface filterProps {
  filter: any;
  width?: number;
  handleFilterUpdate: Function;
}

const SpreadSelect = ({ filter, width, handleFilterUpdate }: filterProps) => {
  const handleChange = (e: any, value: any) => {
    e.persist();
    handleFilterUpdate("spread", value);
  };

  return (
    <>
      {/* {filter[filterType].length > 0 && ( */}
      {true && (
        <FormControl sx={{ width }}>
          <FormLabel>{filterList.spread.label}</FormLabel>
          <Select
            multiple
            // defaultValue={[]}
            color="primary"
            value={filter.spread}
            size={"sm"}
            placeholder={`Filter by ${filterList.spread.label}`}
            onChange={handleChange}
            endDecorator={
              filter.spread.length > 0 && (
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
            {_.map(filterList.spread.options, (option: any, index: number) => {
              return (
                <Option key={index} value={option.value}>
                  {option.label}
                </Option>
              );
            })}
          </Select>
        </FormControl>
      )}
    </>
  );
};

export default SpreadSelect;
