import { Box, FormHelperText, InputAdornment, TextField, Typography } from "@mui/material";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
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

export default function CommonDatePicker(props: props) {
  return (
    <>
      <Typography variant="body1">{props.header}</Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MobileDatePicker
          inputFormat="DD/MM/YYYY"
          mask="__/__/____"
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
          disableFuture
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
