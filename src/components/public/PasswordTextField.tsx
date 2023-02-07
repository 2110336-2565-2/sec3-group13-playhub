import React from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  FormHelperText,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

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
  flexDirection: "row-reverse",
  justifyContent: "space-between",
};

export default function PasswordTextFeild(props: props) {
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
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
                {showPassword ? <VisibilityOff /> : <Visibility />}
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
