import { FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

type props = {
  header?: string;
  placeHolder?: string;
  value: string;
  handleValueChange: (event: SelectChangeEvent) => void;
  items: string[];
};

export default function CommonDropdown(props: props) {
  return (
    <>
      <Typography variant="body1">{props.header}</Typography>
      <FormControl size="small" fullWidth>
        <Select
          value={props.value}
          onChange={props.handleValueChange}
          displayEmpty
          renderValue={
            props.value !== ""
              ? () => <Typography>{props.value}</Typography>
              : () => <Typography color={grey[400]}>{props.placeHolder}</Typography>
          }
        >
          {props.items.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
