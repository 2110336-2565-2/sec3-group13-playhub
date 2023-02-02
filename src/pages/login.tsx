import React from "react";
import Image from "next/image";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

import PasswordTextFeild from "@/components/login/PasswordTextFeild";
import CommonButton from "@/components/public/CommonButton";
import CommonTextFeild from "@/components/public/CommonTextFeild";

// style
const login_components = {
  width: "23vw",
  minWidth: "260px",
  height: "7vh",
  minHeight: "40px",
};

const expression: RegExp =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function Home() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSubmit, setIsSubmit] = React.useState(false);
  const [foundUser, setFoundUser] = React.useState(true);

  function isEmptyEmail() {
    return email.length == 0;
  }

  function isEmptyPassword() {
    return password.length == 0;
  }

  function isValidForm() {
    return expression.test(email);
  }

  async function handleSubmit() {
    setIsSubmit(true);
    fetch("/api/hello").then;
  }

  function handleEmailChange(event: any) {
    setEmail(event.target.value);
    setIsSubmit(false);

    setFoundUser(true);
  }

  function handlePasswordChange(event: any) {
    setPassword(event.target.value);
    setIsSubmit(false);
    setFoundUser(true);
  }

  return (
    <>
      <Grid
        container
        direction="column"
        spacing={3}
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "80vh" }}
      >
        <Grid item>
          <Image src="/images/logo.png" height={119} width={119} alt="Logo" />
        </Grid>
        <Grid item>
          <CommonTextFeild
            placeHolder="Email"
            handleChange={handleEmailChange}
            value={email}
            error={(isEmptyEmail() || !isValidForm() || !foundUser) && isSubmit}
            errorMsg={
              isSubmit
                ? isEmptyEmail()
                  ? "ช่องนี้ไม่สามารถเว้นว่างได้"
                  : isValidForm()
                  ? ""
                  : "รูปแบบอีเมลไม่ถูกต้อง"
                : ""
            }
          />
        </Grid>
        <Grid item>
          <PasswordTextFeild
            handleChange={handlePasswordChange}
            value={password}
            error={(isEmptyPassword() || !foundUser) && isSubmit}
            errorMsg={
              isSubmit
                ? isEmptyPassword()
                  ? "ช่องนี้ไม่สามารถเว้นว่างได้"
                  : ""
                : ""
            }
          />
        </Grid>
        {isSubmit && !foundUser ? (
          <Grid item>
            <Box sx={login_components} display="flex">
              (
              <Typography color="error">อีเมลหรือรหัสผ่านไม่ถูกต้อง</Typography>
              )
            </Box>
          </Grid>
        ) : (
          <></>
        )}

        <Grid item>
          <CommonButton label="Login" onClick={handleSubmit} />
        </Grid>
        <Grid item>
          <Box sx={login_components} display="flex">
            <Typography>Create account{"\u00A0"}</Typography>
            <Link color="primary" underline="hover" href="/register">
              <Typography>here</Typography>
            </Link>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
