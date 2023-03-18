import { useContext, useState } from "react";
import { NextRouter, useRouter } from "next/router";

import { userContext } from "supabase/user_context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  SUPABASE_LOGIN_CREDENTIALS_ERROR,
  SUPABASE_LOGIN_EMAIL_NOT_VALIDATED_ERROR,
} from "@/constants/supabase";
import { Link, Box, Typography, Stack, Button, Card } from "@mui/material";
import { grey } from "@mui/material/colors";

import Loading from "@/components/public/Loading";
import Background from "@/components/public/Background";
import Logo from "@/components/public/Logo";
import CommonTextField from "@/components/public/CommonTextField";
import PasswordTextFeild from "@/components/public/PasswordTextField";
import { validateEmail, validateTextField } from "@/utilities/validation";

import { validation } from "@/types/Validation";
import { PAGE_PATHS } from "enum/PAGES";
import { CHAR_LIMIT } from "enum/INPUT_LIMIT";
import { ICONS } from "enum/ICONS";

import { SignIn } from "@/services/User";
import NormalButton from "@/components/public/CommonButton";

type LoginInput = {
  email: string;
  password: string;
};

type LoginSubmit = {
  email: boolean;
  password: boolean;
};

const LoginStyle = {
  Card: {
    width: "50vw",
    minWidth: "310px",
    minHeight: "200px",

    paddingTop: "6vh",
    paddingBottom: "6vh",

    backgroundColor: grey[300],
  },
  TextField: {
    width: "23vw",
    minWidth: "290px",
  },
};

export default function Home() {
  const router: NextRouter = useRouter();
  const userStatus = useContext(userContext);
  const supabaseClient = useSupabaseClient();

  const [input, setInput] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const [state, setState] = useState<LoginSubmit>({
    email: false,
    password: false,
  });
  const [isLoginCredErr, setIsLoginCredErr] = useState<boolean>(false);
  const [isValidateErr, setIsValidateErr] = useState<boolean>(false);

  // error about variables
  const emailErr: validation = validateEmail(input.email);
  const passwordErr: validation = validateTextField(input.password, CHAR_LIMIT.MIN_PASSWORD);
  const isSupabaseErr: boolean =
    (isLoginCredErr || isValidateErr) && !(emailErr.err || passwordErr.err);
  const supabaseErrMsg: string = isLoginCredErr
    ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
    : "โปรดทำการยืนยันอีเมล";

  async function handleSubmit() {
    setState({
      email: true,
      password: true,
    });

    // sign in via supabase
    SignIn(input.email, input.password, supabaseClient)
      .then(() => {
        // route to post feed page
        router.push(PAGE_PATHS.HOME);
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

  function handleInputChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    setState({ ...state, [event.target.name]: false });
    setInput({ ...input, [event.target.name]: event.target.value });
    // reset error
    setIsLoginCredErr(false);
    setIsValidateErr(false);
  }

  if (userStatus.isLoading) return <Loading />;
  if (userStatus.user) {
    router.push(PAGE_PATHS.HOME);
    return;
  }
  return (
    <Stack style={{ height: "100vh" }} alignItems="center" justifyContent="center">
      <Background />
      <Card sx={LoginStyle.Card}>
        <Stack spacing={3} alignItems="center" justifyContent="center">
          <Logo width={119} height={119} />
          <Stack spacing={0} alignItems="center" justifyContent="center">
            {/* Email TextField */}
            <Box sx={LoginStyle.TextField}>
              <CommonTextField
                name="email"
                placeholder="Email"
                icon={ICONS.MAIL}
                value={input.email}
                handleValueChange={handleInputChange}
                isErr={state.email && (emailErr.err || isSupabaseErr)}
                errMsg={emailErr.msg}
              />
            </Box>

            {/* Password TextField */}
            <Box sx={LoginStyle.TextField}>
              <PasswordTextFeild
                name="password"
                placeholder="Password"
                value={input.password}
                handleValueChange={handleInputChange}
                isErr={state.password && (passwordErr.err || isSupabaseErr)}
                errMsg={passwordErr.msg || supabaseErrMsg}
              />
            </Box>

            {/* Login Button */}
            <NormalButton label="Login" onClick={handleSubmit} />
          </Stack>

          {/* Link go to register page */}
          <Box sx={LoginStyle.TextField} display="flex">
            <Typography variant="body2">New here?{"\u00A0"}</Typography>
            <Link color="primary" href={PAGE_PATHS.REGISTER} sx={{ flexGrow: 1 }}>
              <Typography variant="body2">Sign Up</Typography>
            </Link>

            <Link color="primary" href={PAGE_PATHS.REQUEST_RESET_PASSWORD}>
              <Typography variant="body2">Forgot password?</Typography>
            </Link>
          </Box>
        </Stack>
      </Card>
    </Stack>
  );
}
