import React from "react";
import {
  Box,
  Typography,
  TextField,
  Stack,
  Button,
  SelectChangeEvent,
  Grid,
  InputAdornment,
} from "@mui/material";
import PasswordTextFeild from "@/components/public/PasswordTextField";
import Logo from "@/components/public/Logo";
import { Gender } from "enum/gender";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CommonTextField from "@/components/public/CommonTextField";
import CommonDropdown from "@/components/public/CommonDropdown";
import { validation } from "@/types/Validation";
import { validateEmail, validateTextField } from "@/utilities/validation";
import { CHAR_LIMIT } from "enum/inputLimit";

export default function Home() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isSubmit, setIsSubmit] = React.useState(false);
  const [value, setValue] = React.useState<Dayjs | null>(null);
  const [displayName, setDisplayName] = React.useState<string>("");
  const [gender, setGender] = React.useState<string>("");
  const [birthDate, setBirthDate] = React.useState<Dayjs | null>(dayjs());

  const handleDisplayNameChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setDisplayName(event.target.value);
    setIsSubmit(false);
  };

  function handleEmailChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    setEmail(event.target.value);
    setIsSubmit(false);
  }

  function handlePasswordChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    setPassword(event.target.value);
    setIsSubmit(false);
  }

  function handleConfirmPasswordChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    setConfirmPassword(event.target.value);
    setIsSubmit(false);
  }

  const handleSelectChange = (event: SelectChangeEvent): void => {
    setGender(event.target.value as string);
  };

  const handleBirthDate = (newValue: Dayjs | null) => {
    if (newValue && newValue.isAfter(dayjs())) {
      console.error("Birth Date must be in the past.");
    } else {
      setBirthDate(newValue);
    }
  };

  const displayNameErr: validation = validateTextField(displayName, 1, 100);
  const emailErr: validation = validateEmail(email);
  const passwordErr: validation = validateTextField(password, 1, 100);
  const confirmPasswordErr: validation = validateTextField(confirmPassword, 1, 100);

  const createAccountBtnOnClick = async () => {
    setIsSubmit(true);
    const readyToCreate: boolean = !(
      displayNameErr.err ||
      emailErr.err ||
      passwordErr.err ||
      confirmPasswordErr.err
    );
    if (readyToCreate) {
    }
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
          isErr={isSubmit && displayNameErr.err}
          errMsg={displayNameErr.msg}
        />
      </Box>

      <Box style={{ width: "50vw", marginTop: 0 }}>
        <CommonTextField
          header="Email"
          placeholder="Email"
          value={email}
          handleValueChange={handleEmailChange}
          isErr={isSubmit && emailErr.err}
          errMsg={emailErr.msg}
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
        <Grid container spacing={3} justifyContent="left">
          <Grid item xs={6}>
            <Box style={{ width: "18vw" }}>
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
              <DatePicker
                label="Birth Date"
                value={value}
                onChange={(newValue) => {
                  setValue(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Grid>

      <Button variant="contained" onClick={createAccountBtnOnClick}>
        Create Account
      </Button>
    </Stack>
  );
}
