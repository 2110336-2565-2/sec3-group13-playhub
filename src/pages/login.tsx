import React from "react";
import { Link, Box, Typography, TextField, Stack, FormHelperText } from "@mui/material";

import PasswordTextFeild from "@/components/public/PasswordTextField";
import CommonButton from "@/components/public/CommonButton";
import Logo from "@/components/public/Logo";
import { validateEmail, validateTextField } from "@/utilities/validation";

import { supabase } from "supabase/init";
import { Session } from "@supabase/supabase-js";
import {
  SUPABASE_LOGIN_CREDENTIALS_ERROR,
  SUPABASE_LOGIN_EMAIL_NOT_VALIDATED_ERROR,
} from "@/constants/authentication";
import { useRouter } from "next/router";
import { PagePaths } from "enum/pages";

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

  const emailErrMsg = validateEmail(email);
  const isEmailErr = emailErrMsg !== "";

  const passwordErrMsg = validateTextField(password, 1);
  const isPasswordErr = passwordErrMsg !== "";

  const isSupabaseErr = (isLoginCredErr || isValidateErr) && !(isEmailErr || isPasswordErr);
  const supabaseErrMsg = isLoginCredErr ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง" : "โปรดทำการยืนยันอีเมล";

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
    setSession(signInResult.data.session);
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
      <Stack spacing={3} alignItems="center" justifyContent="center" style={{ minHeight: "100vh" }}>
        <Logo width={119} height={119} />

        <Box sx={login_layout}>
          <TextField
            fullWidth
            label="Email"
            onChange={handleEmailChange}
            value={email}
            error={isSubmit && (isEmailErr || isSupabaseErr)}
          />
          {isSubmit && isEmailErr && (
            <Box display="flex">
              <FormHelperText error>{emailErrMsg}</FormHelperText>
            </Box>
          )}
        </Box>

        <Box sx={login_layout}>
          <PasswordTextFeild
            handleChange={handlePasswordChange}
            value={password}
            error={isSubmit && (isPasswordErr || isSupabaseErr)}
          />
          {isSubmit && isPasswordErr && (
            <Box display="flex">
              <FormHelperText error>{passwordErrMsg}</FormHelperText>
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

        <CommonButton label="Login" onClick={handleSubmit} />

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
