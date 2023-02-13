import React, { useContext } from "react";
import { useRouter } from "next/router";
import { Dayjs } from "dayjs";
import { Box, Stack, Button, SelectChangeEvent, Grid } from "@mui/material";

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { userContext } from "supabase/user_context";

import Loading from "@/components/public/Loading";
import Logo from "@/components/public/Logo";
import CommonTextField from "@/components/public/CommonTextField";
import PasswordTextFeild from "@/components/public/PasswordTextField";
import CommonDropdown from "@/components/public/CommonDropdown";
import CommonDatePicker from "@/components/public/CommonDatePicker";
import { validateEmail, validateTextField } from "@/utilities/validation";

import { Gender } from "enum/gender";
import { CHAR_LIMIT } from "enum/inputLimit";
import { validation } from "@/types/Validation";
import { PagePaths } from "enum/pages";

// style
const register_layout = {
  width: "35vw",
  minWidth: "350px",
};

export default function Home() {
  const supabaseClient = useSupabaseClient<Database>();
  const userStatus = useContext(userContext);
  const router = useRouter();

  // state about variables
  const [displayName, setDisplayName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");
  const [gender, setGender] = React.useState<string>("");
  const [birthDate, setBirthDate] = React.useState<Dayjs | null>(null);

  // submit about variables
  const [isSubmitDisplayName, setIsSubmitDisplayName] = React.useState<boolean>(false);
  const [isSubmitEmail, setIsSubmitEmail] = React.useState<boolean>(false);
  const [isSubmitPassword, setIsSubmitPassword] = React.useState<boolean>(false);
  const [isSubmitConfirmPassword, setIsSubmitConfirmPassword] = React.useState<boolean>(false);
  const [isSubmitGender, setIsSubmitGender] = React.useState<boolean>(false);
  const [isSubmitBirthDate, setIsSubmitBirthDate] = React.useState<boolean>(false);

  // error about variables
  const displayNameErr: validation = validateTextField(
    displayName,
    CHAR_LIMIT.MIN_DISPLAY_NAME,
    CHAR_LIMIT.MAX_DISPLAY_NAME
  );
  const emailErr: validation = validateEmail(email);
  const passwordErr: validation = validateTextField(password, CHAR_LIMIT.MIN_PASSWORD);
  const isValidConfirmPassword: boolean = password === confirmPassword;
  const [isEmptyGender, setIsEmptyGender] = React.useState<boolean>(true);
  const [isEmptyBirthDate, setIsEmptyBirthDate] = React.useState<boolean>(true);

  const readyToCreate: boolean = !(
    displayNameErr.err ||
    emailErr.err ||
    passwordErr.err ||
    !isValidConfirmPassword ||
    isEmptyGender ||
    isEmptyBirthDate
  );

  // handle input change
  const handleDisplayNameChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setDisplayName(event.target.value);
    setIsSubmitDisplayName(false);
  };

  const handleEmailChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setEmail(event.target.value);
    setIsSubmitEmail(false);
  };

  const handlePasswordChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setPassword(event.target.value);
    setIsSubmitPassword(false);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setConfirmPassword(event.target.value);
    setIsSubmitConfirmPassword(false);
  };

  const handleGenderChange = (event: SelectChangeEvent): void => {
    setIsEmptyGender(event.target.value === "");
    setGender(event.target.value as string);
    setIsSubmitGender(false);
  };

  const handleBirthDateChange = (event: Dayjs | null): void => {
    if (event) {
      setIsEmptyBirthDate(event === null);
      setBirthDate(event);
      setIsSubmitBirthDate(false);
    }
  };

  const handleCreateAccount = async () => {
    // display all errors
    setIsSubmitDisplayName(true);
    setIsSubmitEmail(true);
    setIsSubmitPassword(true);
    setIsSubmitConfirmPassword(true);
    setIsSubmitGender(true);
    setIsSubmitBirthDate(true);

    if (readyToCreate) {
      const signUpResult = await supabaseClient.auth.signUp({ email, password });
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
        sex: gender,
      });
      if (addUserData.error) {
        console.log(addUserData.error);
        return;
      }
      router.push(PagePaths.home);
    }
  };

  if (userStatus.isLoading) return <Loading />;
  if (userStatus.user) {
    router.push(PagePaths.home);
    return;
  }
  return (
    <Stack spacing={3} alignItems="center" justifyContent="center" style={{ minHeight: "100vh" }}>
      <Logo width={119} height={119} />

      <Box style={register_layout}>
        <CommonTextField
          header="Username"
          placeholder="Display Name"
          value={displayName}
          handleValueChange={handleDisplayNameChange}
          char_limit={100}
          isErr={isSubmitDisplayName && displayNameErr.err}
          errMsg={displayNameErr.msg}
        />
      </Box>

      <Box style={{ ...register_layout, marginTop: 0 }}>
        <CommonTextField
          header="Email"
          placeholder="Email"
          value={email}
          handleValueChange={handleEmailChange}
          isErr={isSubmitEmail && emailErr.err}
          errMsg={emailErr.msg}
        />
      </Box>

      <Box style={register_layout}>
        <PasswordTextFeild
          header="Password"
          placeholder="Password"
          value={password}
          handleValueChange={handlePasswordChange}
          isErr={isSubmitPassword && passwordErr.err}
          errMsg={passwordErr.msg}
        />
      </Box>

      <Box style={register_layout}>
        <PasswordTextFeild
          header="Confirm Password"
          placeholder="Confirm Password"
          value={confirmPassword}
          handleValueChange={handleConfirmPasswordChange}
          isErr={isSubmitPassword && isSubmitConfirmPassword && !isValidConfirmPassword}
          errMsg="Password และ Confirm Password ต้องเหมือนกัน"
        />
      </Box>

      <Box style={register_layout}>
        <Grid container spacing={3} justifyContent="left">
          <Grid item xs={6}>
            <CommonDropdown
              header="Gender"
              placeHolder="Gender"
              value={gender}
              handleValueChange={handleGenderChange}
              items={Object.values(Gender)}
              isErr={isSubmitGender && isEmptyGender}
              errMsg="ช่องนี้ไม่สามารถเว้นว่างได้"
            />
          </Grid>

          <Grid item xs={6}>
            <CommonDatePicker
              header="Birth Date"
              placeHolder="xx / xx / xxxx"
              value={birthDate}
              handleValueChange={handleBirthDateChange}
              isErr={isSubmitBirthDate && isEmptyBirthDate}
              errMsg="ช่องนี้ไม่สามารถเว้นว่างได้"
            />
          </Grid>
        </Grid>
      </Box>

      <Button variant="contained" onClick={handleCreateAccount}>
        Create Account
      </Button>
    </Stack>
  );
}
