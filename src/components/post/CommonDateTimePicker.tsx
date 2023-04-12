import { Box, FormHelperText, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { LocalizationProvider, MobileDateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import { Dayjs } from "dayjs";
import { ICONS } from "enum/ICONS";

type props = {
  header?: string;
  placeHolder?: string;
  endIcon?: string;
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
  function generateEndIcon() {
    if (props.endIcon === ICONS.EDIT) {
      return <EditIcon fontSize="large" color={props.isErr ? "error" : "secondary"} />;
    }
    return <></>;
  }

  return (
    <>
      <Stack spacing={1}>
        <Box>
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
                />
              )}
              disablePast
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon
                      fontSize="large"
                      color={props.isErr ? "error" : "secondary"}
                    />
                  </InputAdornment>
                ),
                endAdornment: <InputAdornment position="end">{generateEndIcon()}</InputAdornment>,
              }}
            />
          </LocalizationProvider>
        </Box>
        <Box sx={helperText}>
          {props.isErr && <FormHelperText error>{props.errMsg}</FormHelperText>}
          {"\u00A0"}
        </Box>
      </Stack>
    </>
  );
}
