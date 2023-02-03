import React from "react";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import { Typography, TextField } from "@mui/material";

import PasswordTextFeild from "@/components/login/PasswordTextField";
import CommonButton from "@/components/public/CommonButton";
import { validateEmail, validateTextField } from "@/utilities/validation";
import Logo from "@/components/public/Logo";
import Stack from "@mui/material/Stack";

import { supabase } from "supabase/init";
import { Session } from '@supabase/supabase-js'
import { SUPABASE_LOGIN_CREDENTIALS_ERROR, SUPABASE_LOGIN_EMAIL_NOT_VALIDATED_ERROR } from "@/constants/authentication";

// style
const login_components = {
  width: "23vw",
  minWidth: "260px",
  height: "7vh",
  minHeight: "40px",
};

export default function Home() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSubmit, setIsSubmit] = React.useState(false);

  const [foundUser, setFoundUser] = React.useState(true);

  // supabase use a little time to get current session, so some stall display might be needed
  const [isLoadingSession, setIsLoadingSession] = React.useState(true);
  // current session will be null if no user is logged in or supabase is currently getting current session at the start
  const [session, setSession] = React.useState<Session | null>(null);

  async function handleSubmit() {
    setIsSubmit(true);
    const signInResult = await supabase.auth.signInWithPassword({email, password});
    if (signInResult.error && signInResult.error.message == SUPABASE_LOGIN_CREDENTIALS_ERROR) {
      // wrong email or password
      console.log("wrong email or password")
      return;
    }
    if (signInResult.error && signInResult.error.message == SUPABASE_LOGIN_EMAIL_NOT_VALIDATED_ERROR) {
      // user have not validate email yet
      console.log("You have not validate your email yet")
      return;
    }
    setSession(signInResult.data.session);
  }

  function handleEmailChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    setEmail(event.target.value);
    setIsSubmit(false);

    setFoundUser(true);
  }

  function handlePasswordChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    setPassword(event.target.value);
    setIsSubmit(false);

    setFoundUser(true);
  }

  async function handleSignOut() {
    const signOutResult = await supabase.auth.signOut()
    if (signOutResult.error) {
      console.log(signOutResult.error)
      return
    }
    setSession(null)
  }

  React.useEffect(() => {
    supabase.auth.getSession().then((getSessionResult) => {
      setSession(getSessionResult.data.session)
      setIsLoadingSession(false)
    })
  }, [])

  if (isLoadingSession) return <p>getting session...</p> // temporary display that supabase is processing
  if (session != null) return <button onClick={handleSignOut}>logout</button> // temporay display if logged in
  return (
    <>
      <Stack
        direction="column"
        spacing={3}
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Logo width={119} height={119} />
        <TextField
          sx={login_components}
          label="Email"
          onChange={handleEmailChange}
          value={email}
          error={isSubmit && (validateEmail(email) !== "" || !foundUser)}
          helperText={isSubmit && validateEmail(email)}
        />

        <PasswordTextFeild
          handleChange={handlePasswordChange}
          value={password}
          error={
            isSubmit && (validateTextField(password, 1) !== "" || !foundUser)
          }
          errorMsg={isSubmit && validateTextField(password, 1)}
        />

        {isSubmit && !foundUser && (
          <Box sx={login_components} display="flex">
            <Typography color="error">อีเมลหรือรหัสผ่านไม่ถูกต้อง</Typography>
          </Box>
        )}

        <CommonButton label="Login" onClick={handleSubmit} />

        <Box sx={login_components} display="flex">
          <Typography>Create account{"\u00A0"}</Typography>
          <Link color="primary" underline="hover" href="/register">
            <Typography>here</Typography>
          </Link>
        </Box>
      </Stack>
    </>
  );
}