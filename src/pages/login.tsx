import React from "react";
import { Link, Box, Typography, TextField, Stack, FormHelperText, Button } from "@mui/material";

import PasswordTextFeild from "@/components/public/PasswordTextField";
import Logo from "@/components/public/Logo";
import { validateEmail, validateTextField } from "@/utilities/validation";
import { PagePaths } from "enum/pages";

import { useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import {
  SUPABASE_LOGIN_CREDENTIALS_ERROR,
  SUPABASE_LOGIN_EMAIL_NOT_VALIDATED_ERROR,
} from "@/constants/authentication";
import { useRouter } from "next/router";

// style
const login_layout = {
  width: "23vw",
  minWidth: "260px",
};

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSubmit, setIsSubmit] = React.useState(false);
  const [isLoginCredErr, setIsLoginCredErr] = React.useState(false);
  const [isValidateErr, setIsValidateErr] = React.useState(false);

  const emailErr = validateEmail(email);
  const passwordErr = validateTextField(password, 1);

  const isSupabaseErr = (isLoginCredErr || isValidateErr) && !(emailErr.err || passwordErr.err);
  const supabaseErrMsg = isLoginCredErr ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง" : "โปรดทำการยืนยันอีเมล";

  const sessionContext = useSessionContext()
  const supabase = useSupabaseClient()

  async function handleSubmit() {
    setIsSubmit(true);
    const signInResult = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInResult.error && signInResult.error.message == SUPABASE_LOGIN_CREDENTIALS_ERROR) {
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
    router.push(PagePaths.profile);
    return;
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
  }

  if (sessionContext.isLoading) return <p>loading...</p> // temporary display
  if (sessionContext.session) return <button onClick={handleSignOut}>logout</button>; // temporay display if logged in
  return (
    <>
      <Stack spacing={3} alignItems="center" justifyContent="center" style={{ minHeight: "100vh" }}>
        <Logo width={119} height={119} />

        <Box sx={login_layout}>
          <TextField
            fullWidth
            label="Email"
            onChange={handleEmailChange}
            value={email}
            error={isSubmit && (emailErr.err || isSupabaseErr)}
          />
          {isSubmit && emailErr.err && (
            <Box display="flex">
              <FormHelperText error>{emailErr.msg}</FormHelperText>
            </Box>
          )}
        </Box>

        <Box sx={login_layout}>
          <PasswordTextFeild
            handleChange={handlePasswordChange}
            value={password}
            error={isSubmit && (passwordErr.err || isSupabaseErr)}
          />
          {isSubmit && passwordErr.err && (
            <Box display="flex">
              <FormHelperText error>{passwordErr.msg}</FormHelperText>
            </Box>
          )}
        </Box>

        {isSubmit && isSupabaseErr && (
          <Box sx={login_layout} display="flex">
            <FormHelperText error>
              <Typography variant="body1">{supabaseErrMsg}</Typography>
            </FormHelperText>
          </Box>
        )}

        <Button variant="contained" onClick={handleSubmit}>
          Login
        </Button>
        <Box sx={login_layout} display="flex">
          <Typography variant="body1">Create account{"\u00A0"}</Typography>
          <Link color="primary" underline="hover" href={PagePaths.register}>
            <Typography variant="body1">here</Typography>
          </Link>
        </Box>
      </Stack>
    </>
  );
}
