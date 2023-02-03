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

  const [foundUser, setFoundUser] = React.useState(true);

  async function handleSubmit() {
    setIsSubmit(true);
  }

  function handleEmailChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    setEmail(event.target.value);
    setIsSubmit(false);

    setFoundUser(true);
  }

  function handlePasswordChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    setPassword(event.target.value);
    setIsSubmit(false);

    setFoundUser(true);
  }

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
          error={isSubmit && (validateTextField(password, 1) !== "" || !foundUser)}
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
