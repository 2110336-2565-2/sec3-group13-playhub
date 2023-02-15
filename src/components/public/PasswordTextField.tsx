import { useState } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  FormHelperText,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

type props = {
  header?: string;
  label?: string;
  placeholder?: string;
  value: string;
  handleValueChange: (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  isErr: boolean;
  errMsg: string;
  mediumSize?: boolean;
};

const helperText = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
};

export default function PasswordTextFeild(props: props) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleClickShowPassword = (): void => setShowPassword((show) => !show);

  return (
    <>
      <Typography variant="body1">{props?.header}</Typography>
      <TextField
        label={props?.label}
        placeholder={props?.placeholder}
        value={props.value}
        onChange={props.handleValueChange}
        error={props.isErr}
        fullWidth
        size={props.mediumSize ? "medium" : "small"}
        type={showPassword ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword} edge="end">
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Box sx={helperText}>
        {props.isErr && <FormHelperText error>{props.errMsg}</FormHelperText>}
      </Box>
    </>
  );
}
