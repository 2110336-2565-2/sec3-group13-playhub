import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import { Dayjs } from "dayjs";

import { userContext } from "supabase/user_context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { Box, Stack, SelectChangeEvent, Grid, Card, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

import Loading from "@/components/public/Loading";
import Background from "@/components/public/Background";
import Logo from "@/components/public/Logo";
import CommonTextField from "@/components/public/CommonTextField";
import PasswordTextFeild from "@/components/public/PasswordTextField";
import CommonDropdown from "@/components/public/GenderDropdown";
import CommonDatePicker from "@/components/public/CommonDatePicker";
import { validateEmail, validateTextField } from "@/utilities/validation";

import { validation } from "@/types/Validation";
import { GENDER } from "enum/GENDER";
import { CHAR_LIMIT } from "enum/INPUT_LIMIT";
import { PAGE_PATHS } from "enum/PAGES";
import { ICONS } from "enum/ICONS";

import { CreateUser } from "@/services/User";
import NormalButton from "@/components/public/CommonButton";

type RegisterInput = {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  birthDate: Dayjs | null;
};

type RegisterSubmit = {
  displayName: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
  gender: boolean;
  birthDate: boolean;
};

const RegisterStyle = {
  Card: {
    width: "50vw",
    minWidth: "300px",
    minHeight: "820px",

    marginTop: "20px",
    marginBottom: "20px",

    paddingTop: "2vh",
    paddingBottom: "1vh",

    backgroundColor: grey[300],
  },
  TextField: {
    width: "35vw",
    minWidth: "350px",
  },
};

export default function Home() {
  const supabaseClient = useSupabaseClient<Database>();
  const userStatus = useContext(userContext);
  const router = useRouter();

  const [input, setInput] = useState<RegisterInput>({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    birthDate: null,
  });
  const [state, setState] = useState<RegisterSubmit>({
    displayName: false,
    email: false,
    password: false,
    confirmPassword: false,
    gender: false,
    birthDate: false,
  });

  // error about variables
  const displayNameErr: validation = validateTextField(
    input.displayName,
    CHAR_LIMIT.MIN_DISPLAY_NAME,
    CHAR_LIMIT.MAX_DISPLAY_NAME
  );
  const [isEmailAlreadyUsed, setIsEmailAlreadyUsed] = useState<validation>({
    msg: "",
    err: false,
  });
  const emailErr: validation = emailHandlerErr();
  const passwordErr: validation = validateTextField(input.password, CHAR_LIMIT.MIN_PASSWORD);
  const isValidConfirmPassword: boolean = input.password === input.confirmPassword;
  const [isEmptyGender, setIsEmptyGender] = useState<boolean>(true);
  const [isEmptyBirthDate, setIsEmptyBirthDate] = useState<boolean>(true);

  function emailHandlerErr() {
    if (validateEmail(input.email).err) {
      return validateEmail(input.email);
    } else if (isEmailAlreadyUsed.err) {
      return isEmailAlreadyUsed;
    } else {
      return { msg: "", err: false };
    }
  }

  // handle input change
  function handleTextFieldChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    setState({ ...state, [event.target.name]: false });
    setInput({ ...input, [event.target.name]: event.target.value });
  }

  const handleGenderChange = (event: SelectChangeEvent): void => {
    setIsEmptyGender(event.target.value === "");

    setState({ ...state, gender: false });
    setInput({ ...input, gender: event.target.value as string });
  };

  const handleBirthDateChange = (event: Dayjs | null): void => {
    if (event) {
      setIsEmptyBirthDate(event === null);

      setState({ ...state, birthDate: false });
      setInput({ ...input, birthDate: event });
    }
  };

  const handleCreateAccount = () => {
    setState({
      displayName: true,
      email: true,
      password: true,
      confirmPassword: true,
      gender: true,
      birthDate: true,
    });

    const readyToCreate: boolean = !(
      displayNameErr.err ||
      emailErr.err ||
      passwordErr.err ||
      !isValidConfirmPassword ||
      isEmptyGender ||
      isEmptyBirthDate
    );

    if (readyToCreate && input.birthDate) {
      CreateUser(
        input.displayName,
        input.gender,
        input.birthDate.toString(),
        input.email,
        input.password,
        supabaseClient
      )
        .then(() => {
          router.push(PAGE_PATHS.LOGIN);
        })
        .catch((err) => {
          if (err.message == "User already registered") {
            setIsEmailAlreadyUsed({
              msg: "This email already exists.",
              err: true,
            });
          }
          console.log(err);
          return;
        });
    }
  };

  if (userStatus.isLoading) return <Loading />;
  if (userStatus.user) {
    router.push(PAGE_PATHS.HOME);
    return;
  }
  return (
    <Stack style={{ height: "100vh" }} alignItems="center">
      <Background minHeight="900px" minWidth="320px" />
      <Box sx={{ height: "120px" }}></Box>
      <Card sx={RegisterStyle.Card}>
        <Stack spacing={0} alignItems="center" justifyContent="center">
          <Box>
            <Logo width={119} height={119} />
            <Typography variant="h1">Sign Up</Typography>
          </Box>

          <Box style={RegisterStyle.TextField}>
            <CommonTextField
              name="displayName"
              header="Username"
              icon={ICONS.EDIT}
              placeholder="Display Name"
              value={input.displayName}
              handleValueChange={handleTextFieldChange}
              char_limit={100}
              isErr={state.displayName && displayNameErr.err}
              errMsg={displayNameErr.msg}
            />
          </Box>

          <Box style={RegisterStyle.TextField}>
            <CommonTextField
              name="email"
              header="Email"
              icon={ICONS.MAIL}
              placeholder="Email"
              value={input.email}
              handleValueChange={handleTextFieldChange}
              isErr={state.email && emailErr.err}
              errMsg={emailErr.msg}
            />
          </Box>

          <Box style={RegisterStyle.TextField}>
            <PasswordTextFeild
              name="password"
              header="Password"
              placeholder="Password"
              value={input.password}
              handleValueChange={handleTextFieldChange}
              isErr={state.password && passwordErr.err}
              errMsg={passwordErr.msg}
            />
          </Box>

          <Box style={RegisterStyle.TextField}>
            <PasswordTextFeild
              name="confirmPassword"
              header="Confirm Password"
              placeholder="Confirm Password"
              value={input.confirmPassword}
              handleValueChange={handleTextFieldChange}
              isErr={state.password && state.confirmPassword && !isValidConfirmPassword}
              errMsg="Password and Confirm Password must be match."
            />
          </Box>

          <Box style={RegisterStyle.TextField}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <CommonDropdown
                  header="Gender"
                  placeHolder="Gender"
                  value={input.gender}
                  handleValueChange={handleGenderChange}
                  items={Object.values(GENDER)}
                  isErr={state.gender && isEmptyGender}
                  errMsg="This field cannot be blank."
                />
              </Grid>

              <Grid item xs={6}>
                <CommonDatePicker
                  header="Birth Date"
                  placeHolder="xx / xx / xxxx"
                  value={input.birthDate}
                  handleValueChange={handleBirthDateChange}
                  isErr={state.birthDate && isEmptyBirthDate}
                  errMsg="This field cannot be blank."
                />
              </Grid>
            </Grid>
          </Box>

          <NormalButton label="Create Account" onClick={handleCreateAccount} />
        </Stack>
      </Card>
      <Box sx={{ height: "120px" }}></Box>
    </Stack>
  );
}
