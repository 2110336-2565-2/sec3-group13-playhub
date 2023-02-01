import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// type
type props = {
  handleChange: (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  value: string;
  error: boolean;
  errorMsg: string;
};

// style
const password_input = {
  width: "23vw",
  minWidth: "260px",
  height: "7vh",
  minHeight: "40px",
};

export default function PasswordTextFeild(props: props) {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <>
      <TextField
        error={props.error}
        helperText={props.errorMsg}
        onChange={(e) => props.handleChange(e)}
        value={props.value}
        sx={password_input}
        label="Password"
        variant="outlined"
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
