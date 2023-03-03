import {
  Box,
  FormControl,
  FormHelperText,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { grey } from "@mui/material/colors";

type props = {
  header?: string;
  placeHolder?: string;
  value: string;
  handleValueChange: (event: SelectChangeEvent) => void;
  items: string[];
  isErr?: boolean;
  errMsg?: string;
};

const helperText = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
};

export default function CommonDropdown(props: props) {
  return (
    <>
      <Typography variant="body1">{props.header}</Typography>
      <FormControl error={props.isErr} sx={{ backgroundColor: "#ffffff" }} fullWidth>
        <Select
          value={props.value}
          onChange={props.handleValueChange}
          displayEmpty
          renderValue={
            props.value !== ""
              ? () => <Typography lineHeight={1.4}>{props.value}</Typography>
              : () => (
                  <Typography lineHeight={1.4} color={grey[400]}>
                    {props.placeHolder}
                  </Typography>
                )
          }
          inputProps={{
            sx: {
              textAlign: "center",
              "&::placeholder": {
                textAlign: "center",
              },
            },
          }}
          startAdornment={
            <InputAdornment position="start">
              <LockIcon fontSize="large" color={props.isErr ? "error" : "secondary"} />
            </InputAdornment>
          }
        >
          {props.items.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={helperText}>
        {props.isErr && <FormHelperText error>{props.errMsg}</FormHelperText>}
      </Box>
    </>
  );
}
