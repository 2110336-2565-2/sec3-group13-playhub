import { Box, FormHelperText, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { Dayjs } from "dayjs";
import InputLabel from "@mui/material/InputLabel";

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
      <Stack spacing={1}>
        <Box>
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
                  value={props.value}
                  placeholder={props.placeHolder}
                  error={props.isErr}
                  sx={{ backgroundColor: "#ffffff" }}
                  fullWidth
                  inputProps={{
                    ...params.inputProps,
                    sx: {
                      textAlign: "center",
                      "&::placeholder": {
                        textAlign: "center",
                      },
                    },
                  }}
                />
              )}
              disableFuture
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon
                      fontSize="large"
                      color={props.isErr ? "error" : "secondary"}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </LocalizationProvider>
        </Box>
        <Box sx={helperText}>
          <FormHelperText error>
            {props.isErr && props.errMsg}
            {"\u00A0"}
          </FormHelperText>
        </Box>
      </Stack>
    </>
  );
}
