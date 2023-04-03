import { Box, FormHelperText, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { COLOR_CODE } from "enum/COLOR";

type props = {
  name?: string;
  header?: string;
  value: string;
  readOnly?: boolean;
};

const helperText = {
  display: "flex",
  flexDirection: "row-reverse",
  justifyContent: "space-between",
};

export default function NormalTextField(props: props) {
  const dateTimeStyle: string = props.readOnly ? COLOR_CODE.WHITE : COLOR_CODE.DISABLE;
  const isDisabled: boolean = !props.readOnly && true;

  return (
    <>
      <Stack spacing={1}>
        <Box>
          <Typography variant="h3">{props?.header}</Typography>
          <TextField
            name={props.name}
            sx={{ backgroundColor: dateTimeStyle }}
            fullWidth
            value={props.value}
            InputProps={{
              readOnly: props.readOnly,
              startAdornment: (
                <InputAdornment position="start">
                  {<CalendarTodayIcon fontSize="large" color="secondary" />}
                </InputAdornment>
              ),
            }}
            disabled={isDisabled}
          />
        </Box>
        <Box sx={helperText}>
          <FormHelperText error>{"\u00A0"}</FormHelperText>
        </Box>
      </Stack>
    </>
  );
}
