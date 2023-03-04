import {
  Box,
  FormHelperText,
  Icon,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import EditIcon from "@mui/icons-material/Edit";
import { Icons } from "enum/icons";

type props = {
  header?: string;
  icon: string;
  placeholder: string;
  value: string;
  handleValueChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  char_limit?: number;
  isErr: boolean;
  errMsg: string;
};

const helperText = {
  display: "flex",
  flexDirection: "row-reverse",
  justifyContent: "space-between",
};

export default function NormalTextField(props: props) {
  const exceedChar: boolean = props.char_limit ? props.value.length > props.char_limit : false;

  function displayStartIcon(iconName: string) {
    if (iconName === Icons.mail) {
      return <EmailIcon fontSize="large" color={props.isErr ? "error" : "secondary"} />;
    } else if (iconName === Icons.edit) {
      return <EditIcon fontSize="large" color={props.isErr ? "error" : "secondary"} />;
    }
  }

  return (
    <>
      <Stack spacing={1}>
        <Box>
          <Typography variant="body1">{props?.header}</Typography>
          <TextField
            sx={{ backgroundColor: "#ffffff" }}
            fullWidth
            placeholder={props.placeholder}
            value={props.value}
            error={props.isErr}
            onChange={props.handleValueChange}
            inputProps={{
              sx: {
                textAlign: "center",
                "&::placeholder": {
                  textAlign: "center",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">{displayStartIcon(props.icon)}</InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="start">
                  <Icon fontSize="large" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box sx={helperText}>
          <FormHelperText error={exceedChar}>
            {props.char_limit && `${props.value.length}/${props.char_limit}`}
          </FormHelperText>
          <FormHelperText error>
            {props.isErr && props.errMsg}
            {"\u00A0"}
          </FormHelperText>
        </Box>
      </Stack>
    </>
  );
}
