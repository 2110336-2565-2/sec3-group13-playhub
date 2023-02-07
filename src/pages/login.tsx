import React from "react";
import { NextRouter, useRouter } from "next/router";
import { Link, Box, Typography, TextField, Stack, FormHelperText, Button } from "@mui/material";
import { SessionContext, useSessionContext } from "@supabase/auth-helpers-react";

import Logo from "@/components/public/Logo";
import PasswordTextFeild from "@/components/public/PasswordTextField";

import {
  SUPABASE_LOGIN_CREDENTIALS_ERROR,
  SUPABASE_LOGIN_EMAIL_NOT_VALIDATED_ERROR,
} from "@/constants/authentication";
import { validation } from "@/types/Validation";
import { PagePaths } from "enum/pages";

import { validateEmail, validateTextField } from "@/utilities/validation";
import { AuthResponse } from "@supabase/supabase-js";
import InputTextBox from "@/components/public/InputTextBox";

// style
const login_layout = {
  width: "23vw",
  minWidth: "260px",
};

export default function Home() {
  const router: NextRouter = useRouter();
  const sessionContext: SessionContext = useSessionContext();
  const controller = new AbortController();

  // state about variables
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [isSubmit, setIsSubmit] = React.useState<boolean>(false);
  const [isLoginCredErr, setIsLoginCredErr] = React.useState<boolean>(false);
  const [isValidateErr, setIsValidateErr] = React.useState<boolean>(false);

  // error about variables
  const emailErr: validation = validateEmail(email);
  const passwordErr: validation = validateTextField(password, 1);
  const isSupabaseErr: boolean =
    (isLoginCredErr || isValidateErr) && !(emailErr.err || passwordErr.err);
  const supabaseErrMsg: string = isLoginCredErr
    ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
    : "โปรดทำการยืนยันอีเมล";

  React.useEffect(() => {
    return () => controller.abort();
  });

  async function handleSubmit() {
    setIsSubmit(true);

    // sign in via supabase
    const signInResult: AuthResponse = await sessionContext.supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (signInResult.error) {
      // in case : cannot find user using inputed email and password
      if (signInResult.error.message == SUPABASE_LOGIN_CREDENTIALS_ERROR) {
        setIsLoginCredErr(true);
        console.log("wrong email or password");
        return;
      }

      // in case : user has not validate email yet
      if (signInResult.error.message == SUPABASE_LOGIN_EMAIL_NOT_VALIDATED_ERROR) {
        setIsValidateErr(true);
        console.log("You have not validate your email yet");
        return;
      }
    }

    // retrieve user data from supabase
    const fetchResult = await sessionContext.supabaseClient
      .from("User")
      .select("username")
      .eq("email", email);

    // in case : quering is error
    if (fetchResult.error) {
      console.log(fetchResult.error);
      return;
    }

    // in case :no data entry with matching username
    if (fetchResult.count == 0) {
      console.log("cant find the user");
      router.push(PagePaths.login);
      return;
    }

    // route to profile page(homepage when available)
    const usernamePath: string = "/" + fetchResult.data[0].username;
    router.push(PagePaths.profile + usernamePath);
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

  // in case : logged in, the page should go back the page user have been
  // if (sessionContext.session) {
  //   router.back();
  // }

  return (
    <>
      <Stack spacing={3} alignItems="center" justifyContent="center" style={{ minHeight: "100vh" }}>
        <Logo width={119} height={119} />

        <Box sx={login_layout}>
          <InputTextBox
            label="Email"
            value={email}
            handleValueChange={handleEmailChange}
            isErr={isSubmit && (emailErr.err || isSupabaseErr)}
            errMsg={emailErr.msg}
            mediumSize={true}
          />
        </Box>

        <Box sx={login_layout}>
          <PasswordTextFeild
            label="Password"
            value={password}
            handleValueChange={handlePasswordChange}
            isErr={isSubmit && (passwordErr.err || isSupabaseErr)}
            errMsg={passwordErr.msg}
            mediumSize={true}
          />
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
