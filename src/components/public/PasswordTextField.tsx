import React from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type props = {
  label?: string;
  value: string;
  handleChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  error: boolean;
  errorMsg?: string | boolean;
};

export default function PasswordTextFeild(props: props) {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <>
      <TextField
        fullWidth
        label={props.label || "Password"}
        value={props.value}
        onChange={(e) => props.handleChange(e)}
        error={props.error}
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
    </>
  );
}
