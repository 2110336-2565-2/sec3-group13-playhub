import React from "react";
import {
  Box,
  Typography,
  TextField,
  Stack,
  Button,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
  InputAdornment,
} from "@mui/material";
import PasswordTextFeild from "@/components/public/PasswordTextField";
import Logo from "@/components/public/Logo";
import { Gender } from "enum/gender";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CommonTextField from "@/components/public/CommonTextField";
import CommonDropdown from "@/components/public/CommonDropdown";
import { MobileDatePicker } from "@mui/x-date-pickers";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export default function Home() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  // const [isSubmit, setIsSubmit] = React.useState(false);
  const [value, setValue] = React.useState<Dayjs | null>(null);
  const [displayName, setDisplayName] = React.useState<string>("");
  const [gender, setGender] = React.useState<string>("");

  const handleDisplayNameChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setDisplayName(event.target.value);
  };

  function handleEmailChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    setEmail(event.target.value);
  }

  function handlePasswordChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    setPassword(event.target.value);
  }

  function handleConfirmPasswordChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    setConfirmPassword(event.target.value);
  }

  function handleGenderChange(event: SelectChangeEvent<string>): void {
    setGender(event.target.value);
  }

  const handleSelectChange = (event: SelectChangeEvent): void => {
    setGender(event.target.value as string);
  };

  return (
    <Stack spacing={3} alignItems="center" justifyContent="center" style={{ minHeight: "100vh" }}>
      <Logo width={119} height={119} />

      <Box style={{ width: "50vw" }}>
        <CommonTextField
          header="Username"
          placeholder="Display Name"
          value={displayName}
          handleValueChange={handleDisplayNameChange}
          char_limit={100}
          isErr={false}
          errMsg=""
        />
      </Box>

      <Box style={{ width: "50vw", marginTop: 0 }}>
        <CommonTextField
          header="Email"
          placeholder="Email"
          value={email}
          handleValueChange={handleEmailChange}
          isErr={false}
          errMsg=""
        />
      </Box>

      <Box style={{ width: "50vw" }}>
        <PasswordTextFeild
          header="Password"
          placeholder="Password"
          value={password}
          handleValueChange={handlePasswordChange}
          isErr={false}
          errMsg=""
        />
      </Box>

      <Box style={{ width: "50vw" }}>
        <PasswordTextFeild
          header="Confirm Password"
          placeholder="Confirm Password"
          value={confirmPassword}
          handleValueChange={handleConfirmPasswordChange}
          isErr={false}
          errMsg=""
        />
      </Box>

      <Grid item>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box style={{ width: "12vw" }}>
              <CommonDropdown
                header="Gender"
                placeHolder="Gender"
                value={gender}
                handleValueChange={handleSelectChange}
                items={Object.values(Gender)}
              />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Typography>Birth Date</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                value={value}
                onChange={(newValue) => {
                  setValue(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Grid>

      <Button variant="contained">Create Account</Button>
    </Stack>
  );
}
