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
  FormHelperText,
} from "@mui/material";
import PasswordTextFeild from "@/components/public/PasswordTextField";
import Logo from "@/components/public/Logo";
import { Gender } from "enum/gender";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CommonTextField from "@/components/public/CommonTextField";
import CommonDropdown from "@/components/public/CommonDropdown";
import { validation } from "@/types/Validation";
import {
  validateEmail,
  validateTextField,
  validatePasswordTextField,
} from "@/utilities/validation";
import { CHAR_LIMIT } from "enum/inputLimit";
import { MobileDatePicker } from "@mui/x-date-pickers";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export default function Home() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isSubmit, setIsSubmit] = React.useState(false);
  const [isConfirm, setIsConfirm] = React.useState(true);
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
  const passwordErr: validation = validatePasswordTextField(password, 6, 100);
  const confirmPasswordErr: validation = validatePasswordTextField(confirmPassword, 6, 100);
  // const checkPasswordWithConfirmPassword: validation  {
  //   if(password === confirmPassword){
  //     return {msg:"",err:false}
  //   }
  //   else{
  //     return
  //   }
  // }

  const createAccountBtnOnClick = async () => {
    setIsSubmit(true);
    setIsConfirm(password === confirmPassword);
    const readyToCreate: boolean = !(
      displayNameErr.err ||
      emailErr.err ||
      passwordErr.err ||
      confirmPasswordErr.err ||
      !isConfirm
    );
    if (readyToCreate) {
    }
  };

  const helperText = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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
          isErr={isSubmit && passwordErr.err}
          errMsg={passwordErr.msg}
        />
      </Box>

      <Box style={{ width: "50vw" }}>
        <PasswordTextFeild
          header="Confirm Password"
          placeholder="Confirm Password"
          value={confirmPassword}
          handleValueChange={handleConfirmPasswordChange}
          isErr={isSubmit && confirmPasswordErr.err}
          errMsg={confirmPasswordErr.msg}
        />
        <Box sx={helperText} style={{ width: "50vw" }}>
          {!isConfirm && (
            <FormHelperText error>{"Password และ Confirm Password ต้องเหมือนกัน"}</FormHelperText>
          )}
        </Box>
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

      <Button variant="contained" onClick={createAccountBtnOnClick}>
        Create Account
      </Button>
    </Stack>
  );
}
