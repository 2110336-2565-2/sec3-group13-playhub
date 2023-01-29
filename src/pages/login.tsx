import React from "react";
import Image from "next/image";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";

import PasswordTextFeild from "@/components/PasswordTextFeild";
import EmailTextFeild from "@/components/EmailTextFeild";
import ActionButton from "@/components/ActionButton";

export default function Home() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSubmit, setIsSubmit] = React.useState(false);

  function validateForm() {
    return validateEmail() && validatePassword();
  }

  function validateEmail(){
    return email.length > 0;
  }

  function validatePassword(){
    return password.length > 0;
  }

  function handleSubmit() {
    validateForm();
    setIsSubmit(true);
    //login endpoint
  }

  function handleEmailChange(event: any) {
    setEmail(event.target.value);
    setIsSubmit(false);
  }

  function handlePasswordChange(event: any) {
    setPassword(event.target.value);
    setIsSubmit(false);
  }

  return (
    <>
      <Grid
        container
        direction="column"
        spacing={2}
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "80vh" }}
      >
        <Grid item>
          <Image src="/images/logo.png" height={119} width={119} alt="Logo" />
        </Grid>
        <Grid item>
          <EmailTextFeild
            handleChange={handleEmailChange}
            value={email}
            error={!validateEmail() && isSubmit}
          />
        </Grid>
        <Grid item>
          <PasswordTextFeild
            handleChange={handlePasswordChange}
            value={password}
            error={!validatePassword() && isSubmit}
          />
        </Grid>
        <Grid item>
          <ActionButton onClick={handleSubmit} />
        </Grid>
        <Grid item>
          <Box sx={{ width: "20vw", minWidth: "260px" }}>
            <Link color="inherit" underline="hover" href="/register">
              Register?
            </Link>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
