import {
  Box,
  FormControl,
  FormHelperText,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { Gender } from "enum/gender";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import FavoriteIcon from "@mui/icons-material/Favorite";

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
  function displayGenderIcon(gender: string) {
    if (gender === Gender.male) {
      return <MaleIcon fontSize="large" color={props.isErr ? "error" : "secondary"} />;
    } else if (gender === Gender.female) {
      return <FemaleIcon fontSize="large" color={props.isErr ? "error" : "secondary"} />;
    } else if (gender === Gender.others) {
      return <TransgenderIcon fontSize="large" color={props.isErr ? "error" : "secondary"} />;
    } else {
      return <FavoriteIcon fontSize="large" color={props.isErr ? "error" : "secondary"} />;
    }
  }

  return (
    <>
      <Stack spacing={1}>
        <Box>
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
                <InputAdornment position="start">{displayGenderIcon(props.value)}</InputAdornment>
              }
            >
              {props.items.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
