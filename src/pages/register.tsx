import React, { useContext } from "react";
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
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CommonTextField from "@/components/public/CommonTextField";
import CommonDropdown from "@/components/public/CommonDropdown";
import { validation } from "@/types/Validation";
import { validateEmail, validateTextField } from "@/utilities/validation";
import { MobileDatePicker } from "@mui/x-date-pickers";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { userContext } from "supabase/user_context";
import Loading from "@/components/public/Loading";

export default function Home() {
  const supabaseClient = useSupabaseClient<Database>();
  const userStatus = useContext(userContext);
  const [displayName, setDisplayName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");
  const [isValidConfirmPassword, setIsValidConfirmPassword] = React.useState<boolean>(true);
  const [gender, setGender] = React.useState<string>("");
  const [isValidGender, setIsValidGender] = React.useState<boolean>(true);
  const [birthDate, setBirthDate] = React.useState<Dayjs | null>(null);
  const [isValidBirthDate, setIsValidBirthDate] = React.useState<boolean>(true);
  const [isSubmit, setIsSubmit] = React.useState<boolean>(false);

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

  const displayNameErr: validation = validateTextField(displayName, 1, 100);
  const emailErr: validation = validateEmail(email);
  const passwordErr: validation = validateTextField(password, 6, 100);
  const confirmPasswordErr: validation = validateTextField(confirmPassword, 6, 100);

  const createAccountBtnOnClick = async () => {
    setIsSubmit(true);
    setIsValidGender(!(gender === ""));
    setIsValidBirthDate(!(birthDate === null));
    setIsValidConfirmPassword(true);
    if (password.length > 5 && confirmPassword.length > 5) {
      setIsValidConfirmPassword(password === confirmPassword);
    }
    const readyToCreate: boolean = !(
      displayNameErr.err ||
      emailErr.err ||
      passwordErr.err ||
      confirmPasswordErr.err ||
      !isValidConfirmPassword
    );
    if (readyToCreate) {
      const signUpResult = await supabaseClient.auth.signUp({email, password});
      if (signUpResult.error) {
        // one possible error is request sign up repeatedly too fast
        console.log(signUpResult.error);
        return;
      }
      const addUserData = await supabaseClient.rpc("add_user", {
        user_id: signUpResult.data.user?.id,
        username: displayName,
        password: password,
        email: email,
        birthdate: birthDate,
        sex: gender
      })
      if (addUserData.error) {
        console.log(addUserData.error)
        return
      }
      console.log("sign up done")
      // route to somewhere
    }
  };

  const helperText = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  };

  if (userStatus.isLoading) return <Loading isLoading/> //temporary
  if (userStatus.user) return <p>logged in</p> //temporary
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
          isErr={isSubmit && (passwordErr.err || !isValidConfirmPassword)}
          errMsg={passwordErr.msg}
        />
      </Box>

      <Box style={{ width: "50vw" }}>
        <PasswordTextFeild
          header="Confirm Password"
          placeholder="Confirm Password"
          value={confirmPassword}
          handleValueChange={handleConfirmPasswordChange}
          isErr={isSubmit && (confirmPasswordErr.err || !isValidConfirmPassword)}
          errMsg={
            isValidConfirmPassword
              ? confirmPasswordErr.msg
              : "Password และ Confirm Password ต้องเหมือนกัน"
          }
        />
      </Box>

      <Grid item width={"50vw"}>
        <Grid container spacing={3} justifyContent="left">
          <Grid item xs={6}>
            <CommonDropdown
              header="Gender"
              placeHolder="Gender"
              value={gender}
              handleValueChange={handleSelectChange}
              items={Object.values(Gender)}
            />
            <Box sx={helperText}>
              {!isValidGender && (
                <FormHelperText error>{"ช่องนี้ไม่สามารถเว้นว่างได้"}</FormHelperText>
              )}
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Typography>Birth Date</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                inputFormat="DD/MM/YYYY"
                mask="__/__/____"
                value={birthDate}
                disableFuture={true}
                onChange={(newBirthDate) => {
                  setBirthDate(newBirthDate);
                }}
                renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </LocalizationProvider>
            <Box sx={helperText}>
              {!isValidBirthDate && (
                <FormHelperText error>{"ช่องนี้ไม่สามารถเว้นว่างได้"}</FormHelperText>
              )}
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <Button variant="contained" onClick={createAccountBtnOnClick}>
        Create Account
      </Button>
    </Stack>
  );
}
