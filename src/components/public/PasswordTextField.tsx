import { useState } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  FormHelperText,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

type props = {
  header?: string;
  label?: string;
  placeholder?: string;
  value: string;
  handleValueChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
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
        sx={{ backgroundColor: "#ffffff" }}
        fullWidth
        placeholder={props.placeholder}
        value={props.value}
        error={props.isErr}
        onChange={props.handleValueChange}
        type={showPassword ? "text" : "password"}
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
            <InputAdornment position="start">
              <LockIcon fontSize="large" color={props.isErr ? "error" : "secondary"} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword} edge="end">
                {showPassword ? (
                  <VisibilityOffIcon fontSize="large" color={props.isErr ? "error" : "secondary"} />
                ) : (
                  <VisibilityIcon fontSize="large" color={props.isErr ? "error" : "secondary"} />
                )}
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
