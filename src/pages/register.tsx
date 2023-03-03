import { useContext, useState } from "react";

import { useRouter } from "next/router";

import { Dayjs } from "dayjs";

import { userContext } from "supabase/user_context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";

import { Box, Stack, Button, SelectChangeEvent, Grid, Card, Typography } from "@mui/material";

import Loading from "@/components/public/Loading";
import Logo from "@/components/public/Logo";
import CommonTextField from "@/components/public/CommonTextField";
import PasswordTextFeild from "@/components/public/PasswordTextField";
import CommonDropdown from "@/components/public/CommonDropdown";
import CommonDatePicker from "@/components/public/CommonDatePicker";

import { validateEmail, validateTextField } from "@/utilities/validation";
import { validation } from "@/types/Validation";
import { Gender } from "enum/gender";
import { CHAR_LIMIT } from "enum/inputLimit";
import { PagePaths } from "enum/pages";
import { CreateUser } from "@/services/User";
import Background from "@/components/public/Background";
import { grey } from "@mui/material/colors";
import NormalTextField from "@/components/public/NormalTextField";

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
  const [displayName, setDisplayName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [birthDate, setBirthDate] = useState<Dayjs | null>(null);

  // submit about variables
  const [isSubmitDisplayName, setIsSubmitDisplayName] = useState<boolean>(false);
  const [isSubmitEmail, setIsSubmitEmail] = useState<boolean>(false);
  const [isSubmitPassword, setIsSubmitPassword] = useState<boolean>(false);
  const [isSubmitConfirmPassword, setIsSubmitConfirmPassword] = useState<boolean>(false);
  const [isSubmitGender, setIsSubmitGender] = useState<boolean>(false);
  const [isSubmitBirthDate, setIsSubmitBirthDate] = useState<boolean>(false);

  // error about variables
  const displayNameErr: validation = validateTextField(
    displayName,
    CHAR_LIMIT.MIN_DISPLAY_NAME,
    CHAR_LIMIT.MAX_DISPLAY_NAME
  );

  // Must declare isEmailAlreadyUsed before emailErr !
  const [isEmailAlreadyUsed, setIsEmailAlreadyUsed] = useState<validation>({
    msg: "",
    err: false,
  });
  const emailErr: validation = emailHandlerErr();
  const passwordErr: validation = validateTextField(password, CHAR_LIMIT.MIN_PASSWORD);
  const isValidConfirmPassword: boolean = password === confirmPassword;
  const [isEmptyGender, setIsEmptyGender] = useState<boolean>(true);
  const [isEmptyBirthDate, setIsEmptyBirthDate] = useState<boolean>(true);

  const readyToCreate: boolean = !(
    displayNameErr.err ||
    emailErr.err ||
    passwordErr.err ||
    !isValidConfirmPassword ||
    isEmptyGender ||
    isEmptyBirthDate
  );

  function emailHandlerErr() {
    if (validateEmail(email).err) {
      return validateEmail(email);
    } else if (isEmailAlreadyUsed.err) {
      return isEmailAlreadyUsed;
    } else {
      return { msg: "", err: false };
    }
  }

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
    setIsEmailAlreadyUsed({ msg: "", err: false });
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

    if (!birthDate) return;

    if (readyToCreate) {
      CreateUser(displayName, gender, birthDate.toString(), email, password, supabaseClient)
        .then(() => {
          router.push(PagePaths.login);
        })
        .catch((err) => {
          if (err.message == "User already registered") {
            setIsEmailAlreadyUsed({
              msg: "ชื่ออีเมลนี้มีผู้ใช้งานแล้ว",
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
    router.push(PagePaths.home);
    return;
  }
  return (
    <Stack style={{ height: "100vh" }} alignItems="center" justifyContent="center">
      <Background />
      <Card
        sx={{
          width: "45vw",
          minWidth: "300px",
          minHeight: "200px",

          paddingTop: "3vh",
          paddingBottom: "3vh",

          backgroundColor: grey[300],
        }}
      >
        <Stack spacing={3} alignItems="center" justifyContent="center">
          <Box>
            <Logo width={119} height={119} />
            <Typography variant="h1">Sign Up</Typography>
          </Box>

          <Box style={register_layout}>
            <NormalTextField
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
            <NormalTextField
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
      </Card>
    </Stack>
  );
}
