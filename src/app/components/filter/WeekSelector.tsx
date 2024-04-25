import _ from "lodash";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { Box, FormControl, FormLabel, IconButton } from "@mui/joy";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface filterProps {
  selectedWeek: number;
  setSelectedWeek: Function;
  weeks: any;
}

const WeekSelector = ({
  selectedWeek,
  setSelectedWeek,
  weeks,
}: filterProps) => {
  const weekOptions = _.map(_.orderBy(weeks, "index"), (week: any) => {
    return {
      name: `Week of ${week.date}`,
      value: week.index,
    };
  });

  const handleChange = (e: any, value: any) => {
    e.persist();
    setSelectedWeek(value);
  };

  return (
    <>
      {true && (
        <FormControl>
          {/* <FormLabel>Select Week</FormLabel> */}
          <Select
            value={selectedWeek}
            size={"sm"}
            onChange={handleChange}
            color="neutral"
            startDecorator={
              <IconButton
                style={{ zIndex: 1 }}
                disabled={selectedWeek <= 0}
                onClick={() => {
                  setSelectedWeek(selectedWeek - 1);
                }}>
                <ArrowBackIosIcon />
              </IconButton>
            }
            endDecorator={
              <IconButton
                disabled={selectedWeek + 1 > weeks.length - 1}
                onClick={() => {
                  setSelectedWeek(selectedWeek + 1);
                }}>
                <ArrowForwardIosIcon />
              </IconButton>
            }
            renderValue={(selected: any) => {
              return (
                <Box sx={{ display: "flex", gap: "0.25rem" }}>
                  {selected.label}
                </Box>
              );
            }}
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
            {_.map(weekOptions, (weekOption: any, index: number) => {
              return (
                <Option key={index} value={weekOption.value}>
                  {weekOption.name}
                </Option>
              );
            })}
          </Select>
        </FormControl>
      )}
    </>
  );
};

export default WeekSelector;
