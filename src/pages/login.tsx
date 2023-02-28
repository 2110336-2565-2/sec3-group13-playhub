import React, { useContext, useState } from "react";

import { NextRouter, useRouter } from "next/router";

import { AuthResponse } from "@supabase/supabase-js";
import { userContext } from "supabase/user_context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { Link, Box, Typography, Stack, FormHelperText, Button } from "@mui/material";

import Loading from "@/components/public/Loading";
import Logo from "@/components/public/Logo";
import CommonTextField from "@/components/public/CommonTextField";
import PasswordTextFeild from "@/components/public/PasswordTextField";
import { validateEmail, validateTextField } from "@/utilities/validation";

import {
  SUPABASE_LOGIN_CREDENTIALS_ERROR,
  SUPABASE_LOGIN_EMAIL_NOT_VALIDATED_ERROR,
} from "@/constants/supabase";
import { validation } from "@/types/Validation";
import { PagePaths } from "enum/pages";
import { CHAR_LIMIT } from "enum/inputLimit";
import { SignIn } from "@/services/User";

// style
const login_layout = {
  width: "23vw",
  minWidth: "260px",
};

export default function Home() {
  const router: NextRouter = useRouter();
  const userStatus = useContext(userContext);
  const supabaseClient = useSupabaseClient();

  // state about variables
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [isLoginCredErr, setIsLoginCredErr] = useState<boolean>(false);
  const [isValidateErr, setIsValidateErr] = useState<boolean>(false);

  // error about variables
  const emailErr: validation = validateEmail(email);
  const passwordErr: validation = validateTextField(password, CHAR_LIMIT.MIN_PASSWORD);
  const isSupabaseErr: boolean =
    (isLoginCredErr || isValidateErr) && !(emailErr.err || passwordErr.err);
  const supabaseErrMsg: string = isLoginCredErr
    ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
    : "โปรดทำการยืนยันอีเมล";

  async function handleSubmit() {
    setIsSubmit(true);

    // sign in via supabase
    SignIn(email, password, supabaseClient)
      .then(() => {
        // route to post feed page
        router.push(PagePaths.home);
      })
      .catch((err) => {
        // in case : cannot find user using inputed email and password
        if (err == "Error: " + SUPABASE_LOGIN_CREDENTIALS_ERROR) {
          setIsLoginCredErr(true);
          console.log("wrong email or password");
          return;
        }

        // in case : user has not validate email yet
        if (err == "Error: " + SUPABASE_LOGIN_EMAIL_NOT_VALIDATED_ERROR) {
          setIsValidateErr(true);
          console.log("You have not validate your email yet");
          return;
        }
      });
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

  if (userStatus.isLoading) return <Loading />;
  if (userStatus.user) {
    router.push(PagePaths.home);
    return;
  }
  return (
    <Stack
      component={Box}
      spacing={3}
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Logo width={119} height={119} />

      {/* Email TextField */}
      <Box sx={login_layout}>
        <CommonTextField
          label="Email"
          value={email}
          handleValueChange={handleEmailChange}
          isErr={isSubmit && (emailErr.err || isSupabaseErr)}
          errMsg={emailErr.msg}
          mediumSize={true}
        />
      </Box>

      {/* Password TextField */}
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

      {/* Login Error Message */}
      {isSubmit && isSupabaseErr && (
        <Box sx={login_layout} display="flex">
          <FormHelperText error>
            <Typography variant="body1">{supabaseErrMsg}</Typography>
          </FormHelperText>
        </Box>
      )}

      {/* Login Button */}
      <Button variant="contained" onClick={handleSubmit}>
        Login
      </Button>

      {/* Link go to register page */}
      <Box sx={login_layout} display="flex">
        <Typography variant="body1">Create account{"\u00A0"}</Typography>
        <Link color="primary" underline="hover" href={PagePaths.register}>
          <Typography variant="body1">here</Typography>
        </Link>
      </Box>
    </Stack>
  );
}
