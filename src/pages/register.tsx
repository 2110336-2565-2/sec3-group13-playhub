import React, { useContext } from "react";
import { Box, Stack, Button, SelectChangeEvent, Grid } from "@mui/material";
import PasswordTextFeild from "@/components/public/PasswordTextField";
import Logo from "@/components/public/Logo";
import { Gender } from "enum/gender";
import { Dayjs } from "dayjs";
import CommonTextField from "@/components/public/CommonTextField";
import CommonDropdown from "@/components/public/CommonDropdown";
import { validation } from "@/types/Validation";
import { validateEmail, validateTextField } from "@/utilities/validation";
import CommonDatePicker from "@/components/public/CommonDatePicker";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { userContext } from "supabase/user_context";
import Loading from "@/components/public/Loading";
import { useRouter } from "next/router";

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

  // error about variables
  const displayNameErr: validation = validateTextField(displayName, 1, 100);
  const emailErr: validation = validateEmail(email);
  const passwordErr: validation = validateTextField(password, 6, 100);
  const confirmPasswordErr: validation = validateTextField(confirmPassword, 6, 100);
  const isValidConfirmPassword: boolean =
    !(passwordErr.err || confirmPasswordErr.err) && password === confirmPassword;
  const [isEmptyGender, setIsEmptyGender] = React.useState<boolean>(true);
  const [isEmptyBirthDate, setIsEmptyBirthDate] = React.useState<boolean>(true);

  const [isSubmit, setIsSubmit] = React.useState<boolean>(false);

  const readyToCreate: boolean = !(
    displayNameErr.err ||
    emailErr.err ||
    passwordErr.err ||
    confirmPasswordErr.err ||
    !isValidConfirmPassword ||
    isEmptyGender ||
    isEmptyBirthDate
  );

  // handle input change
  const handleDisplayNameChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setDisplayName(event.target.value);
  };

  const handleEmailChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setConfirmPassword(event.target.value);
  };

  const handleGenderChange = (event: SelectChangeEvent): void => {
    setIsEmptyGender(event.target.value === "");
    setGender(event.target.value as string);
  };

  const handleBirthDateChange = (event: Dayjs | null): void => {
    if (event) {
      setIsEmptyBirthDate(event === null);
      setBirthDate(event);
    }
  };

  const handleCreateAccount = async () => {
    setIsSubmit(true);
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
      router.push("/login");
    }
  };

  // if (userStatus.isLoading) return <Loading isLoading />; //temporary
  // if (userStatus.user) return <p>logged in</p>; //temporary

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
          isErr={isSubmit && displayNameErr.err}
          errMsg={displayNameErr.msg}
        />
      </Box>

      <Box style={{ ...register_layout, marginTop: 0 }}>
        <CommonTextField
          header="Email"
          placeholder="Email"
          value={email}
          handleValueChange={handleEmailChange}
          isErr={isSubmit && emailErr.err}
          errMsg={emailErr.msg}
        />
      </Box>

      <Box style={register_layout}>
        <PasswordTextFeild
          header="Password"
          placeholder="Password"
          value={password}
          handleValueChange={handlePasswordChange}
          isErr={isSubmit && (passwordErr.err || !isValidConfirmPassword)}
          errMsg={passwordErr.msg}
        />
      </Box>

      <Box style={register_layout}>
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

      <Grid item sx={register_layout}>
        <Grid container spacing={3} justifyContent="left">
          <Grid item xs={6}>
            <CommonDropdown
              header="Gender"
              placeHolder="Gender"
              value={gender}
              handleValueChange={handleGenderChange}
              items={Object.values(Gender)}
              isErr={isSubmit && isEmptyGender}
              errMsg="ช่องนี้ไม่สามารถเว้นว่างได้"
            />
          </Grid>

          <Grid item xs={6}>
            <CommonDatePicker
              header="Birth Date"
              placeHolder="xx / xx / xxxx"
              value={birthDate}
              handleValueChange={handleBirthDateChange}
              isErr={isSubmit && isEmptyBirthDate}
              errMsg="ช่องนี้ไม่สามารถเว้นว่างได้"
            />
          </Grid>
        </Grid>
      </Grid>

      <Button variant="contained" onClick={handleCreateAccount}>
        Create Account
      </Button>
    </Stack>
  );
}
