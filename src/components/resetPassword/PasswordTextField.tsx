import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";

type props = {
  name?: string;
  placeholder: string;
  value: string;
  handleValueChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  isErr: boolean;
};

export default function PasswordTextField(props: props) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleClickShowPassword = (): void => setShowPassword((show) => !show);

  return (
    <>
      <TextField
        name={props.name}
        sx={{ backgroundColor: "#ffffff" }}
        fullWidth
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.handleValueChange}
        error={props.isErr}
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
              <LockIcon color={props.isErr ? "error" : "secondary"} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword} edge="end">
                {showPassword ? (
                  <VisibilityOffIcon color={props.isErr ? "error" : "secondary"} />
                ) : (
                  <VisibilityIcon color={props.isErr ? "error" : "secondary"} />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </>
  );
}
