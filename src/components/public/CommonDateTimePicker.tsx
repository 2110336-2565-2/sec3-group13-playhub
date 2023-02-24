import {
  Box,
  FormHelperText,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { Dayjs } from "dayjs";

type props = {
  header?: string;
  placeHolder?: string;
  value: Dayjs | null;
  handleValueChange: (event: Dayjs | null) => void;
  isErr: boolean;
  errMsg: string;
};

const helperText = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
};

export default function CommonDateTimePicker(props: props) {
  return (
    <>
      <Typography variant="body1">{props.header}</Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MobileDateTimePicker
          inputFormat="DD/MM/YYYY hh:mm a"
          mask="__/__/____ __:__ _M"
          value={props.value}
          onChange={props.handleValueChange}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={props.placeHolder}
              error={props.isErr}
              fullWidth
              size="small"
            />
          )}
          disablePast
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarTodayIcon />
              </InputAdornment>
            ),
          }}
        />
      </LocalizationProvider>
      <Box sx={helperText}>
        {props.isErr && <FormHelperText error>{props.errMsg}</FormHelperText>}
      </Box>
    </>
  );
}
