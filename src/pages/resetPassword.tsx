import React, { useState, useEffect } from "react";
import { NextRouter, useRouter } from "next/router";
import { Box, Card, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

import Loading from "@/components/public/Loading";
import Background from "@/components/public/Background";
import PasswordTextField from "@/components/public/PasswordTextField";
import { validateConfirmNewPassword } from "@/utilities/validation";

import { validation } from "@/types/Validation";
import { PAGE_PATHS } from "enum/PAGES";

import { Service } from "@/services";
import NormalButton from "@/components/public/CommonButton";

type ResetPasswordInput = {
  password: string;
  confirmPassword: string;
};

const ResetPasswordStyle = {
  Card: {
    width: "45vw",
    minWidth: "300px",
    minHeight: "200px",

    backgroundColor: grey[300],
  },
  TextField: {
    width: "20vw",
    minWidth: "250px",
  },
};

export default function Home() {
  const service = new Service();
  const router: NextRouter = useRouter();
  const [canResetPassword, setCanResetPassword] = useState(false);

  const [newPassword, setNewPassword] = useState<ResetPasswordInput>({
    password: "",
    confirmPassword: "",
  });

  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  const arePasswordsErr: validation = validateConfirmNewPassword(
    newPassword.password,
    newPassword.confirmPassword
  );

  function handlePasswordChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    setIsSubmit(false);
    setNewPassword({ ...newPassword, [event.target.name]: event.target.value });
  }

  function handleSubmit() {
    setIsSubmit(true);

    if (!arePasswordsErr.err) {
      // reset password end point goes here
      setIsRequesting(true);
      service.password
        .ResetPassword(newPassword.password)
        .then(() => {
          router.push(PAGE_PATHS.SUCCESS_RESET_PASSWORD);
          return;
        })
        .catch((err) => {
          setIsRequesting(false);
          console.log(err);
          return;
        });
    }
  }

  useEffect(() => {
    service.supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        setCanResetPassword(true);
      }
    });
  }, [service.supabaseClient.auth]);

  useEffect(() => {
    if (router.asPath.indexOf("access_token") == -1) {
      router.push(PAGE_PATHS.REQUEST_RESET_PASSWORD);
      return;
    }
  }, [router]);

  if (!canResetPassword) return <Loading />;
  return (
    <>
      {isRequesting && <Loading />}
      <Stack style={{ height: "100vh" }} alignItems="center" justifyContent="center">
        <Background />
        <Card sx={ResetPasswordStyle.Card}>
          <Stack
            spacing={3}
            sx={{
              padding: "40px",
            }}
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h2">Reset Password</Typography>

            <Box sx={ResetPasswordStyle.TextField}>
              <PasswordTextField
                name="password"
                placeholder="New Password"
                value={newPassword.password}
                handleValueChange={handlePasswordChange}
                isErr={isSubmit && arePasswordsErr.err}
                errMsg=""
              />

              <PasswordTextField
                name="confirmPassword"
                placeholder="Comfirm New Password"
                value={newPassword.confirmPassword}
                handleValueChange={handlePasswordChange}
                isErr={isSubmit && arePasswordsErr.err}
                errMsg={arePasswordsErr.msg}
              />
            </Box>

            <NormalButton label="Reset Password" onClick={handleSubmit} />
          </Stack>
        </Card>
      </Stack>
    </>
  );
}
