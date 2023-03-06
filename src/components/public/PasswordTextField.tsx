import { useState } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  FormHelperText,
  Typography,
  Stack,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

type props = {
  name?: string;
  header?: string;
  placeholder: string;
  value: string;
  handleValueChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  isErr: boolean;
  errMsg: string;
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
      <Stack spacing={1}>
        <Box>
          <Typography variant="body1">{props?.header}</Typography>
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
                  <LockIcon fontSize="large" color={props.isErr ? "error" : "secondary"} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? (
                      <VisibilityOffIcon
                        fontSize="large"
                        color={props.isErr ? "error" : "secondary"}
                      />
                    ) : (
                      <VisibilityIcon
                        fontSize="large"
                        color={props.isErr ? "error" : "secondary"}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
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
