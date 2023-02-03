import React from "react";
import { Link, Box, Typography, TextField, Stack } from "@mui/material";

import PasswordTextFeild from "@/components/login/PasswordTextField";
import CommonButton from "@/components/public/CommonButton";
import Logo from "@/components/public/Logo";
import { validateEmail, validateTextField } from "@/utilities/validation";

import { supabase } from "supabase/init";
import { Session } from "@supabase/supabase-js";
import {
  SUPABASE_LOGIN_CREDENTIALS_ERROR,
  SUPABASE_LOGIN_EMAIL_NOT_VALIDATED_ERROR,
} from "@/constants/authentication";

// style
const login_layout = {
  width: "23vw",
  minWidth: "260px",
};

const text_field = {
  height: "7vh",
  minHeight: "40px",
};

export default function Home() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSubmit, setIsSubmit] = React.useState(false);
  const [isLoginCredErr, setIsLoginCredErr] = React.useState(false);
  const [isValidateErr, setIsValidateErr] = React.useState(false);

  const emailErrMsg = validateEmail(email);
  const isEmailErr = emailErrMsg !== "";

  const passwordErrMsg = validateTextField(password, 1);
  const isPasswordErr = passwordErrMsg !== "";

  const isSupabaseErr =
    (isLoginCredErr || isValidateErr) && !(isEmailErr || isPasswordErr);
  const supabaseErrMsg = isLoginCredErr
    ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
    : "โปรดทำการยืนยันอีเมล";

  // supabase use a little time to get current session, so some stall display might be needed
  const [isLoadingSession, setIsLoadingSession] = React.useState(true);
  // current session will be null if no user is logged in or supabase is currently getting current session at the start
  const [session, setSession] = React.useState<Session | null>(null);

  async function handleSubmit() {
    setIsSubmit(true);
    const signInResult = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (
      signInResult.error &&
      signInResult.error.message == SUPABASE_LOGIN_CREDENTIALS_ERROR
    ) {
      // wrong email or password
      setIsLoginCredErr(true);
      console.log("wrong email or password");
      return;
    }
    if (
      signInResult.error &&
      signInResult.error.message == SUPABASE_LOGIN_EMAIL_NOT_VALIDATED_ERROR
    ) {
      // user have not validate email yet
      setIsValidateErr(true);
      console.log("You have not validate your email yet");
      return;
    }
    setSession(signInResult.data.session);
  }

  function handleEmailChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    setEmail(event.target.value);
    setIsSubmit(false);
    // reset error
    setIsLoginCredErr(false);
    setIsValidateErr(false);
  }

  function handlePasswordChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    setPassword(event.target.value);
    setIsSubmit(false);
    // reset error
    setIsLoginCredErr(false);
    setIsValidateErr(false);
  }

  async function handleSignOut() {
    const signOutResult = await supabase.auth.signOut();
    if (signOutResult.error) {
      console.log(signOutResult.error);
      return;
    }
    setSession(null);
  }

  React.useEffect(() => {
    supabase.auth.getSession().then((getSessionResult: any) => {
      setSession(getSessionResult.data.session);
      setIsLoadingSession(false);
    });
  }, []);

  if (isLoadingSession) return <p>getting session...</p>; // temporary display that supabase is processing
  if (session != null) return <button onClick={handleSignOut}>logout</button>; // temporay display if logged in

  return (
    <>
      <Stack
        spacing={3}
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Logo width={119} height={119} />

        <TextField
          sx={{ ...login_layout, ...text_field }}
          label="Email"
          onChange={handleEmailChange}
          value={email}
          error={isSubmit && (isEmailErr || isSupabaseErr)}
          helperText={isSubmit && emailErrMsg}
        />

        <PasswordTextFeild
          handleChange={handlePasswordChange}
          value={password}
          error={isSubmit && (isPasswordErr || isSupabaseErr)}
          errorMsg={isSubmit && passwordErrMsg}
        />

        {isSubmit && isSupabaseErr && (
          <Box sx={login_layout} display="flex">
            <Typography color="error">{supabaseErrMsg}</Typography>
          </Box>
        )}

        <CommonButton label="Login" onClick={handleSubmit} />

        <Box sx={login_layout} display="flex">
          <Typography>Create account{"\u00A0"}</Typography>
          <Link color="primary" underline="hover" href="/register">
            <Typography>here</Typography>
          </Link>
        </Box>
      </Stack>
    </>
  );
}
