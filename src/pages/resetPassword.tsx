import { useContext, useState } from "react";
import { NextRouter, useRouter } from "next/router";
import { Box, Button, Card, FormHelperText, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { userContext } from "supabase/user_context";

import Background from "@/components/public/Background";
import PasswordTextField from "@/components/resetPassword/PasswordTextField";
import { validateConfirmPassword } from "@/utilities/validation";

import { validation } from "@/types/Validation";
import { PagePaths } from "enum/pages";

type ResetPassword = {
  password: string;
  confirmPassword: string;
};

export default function Home() {
  const router: NextRouter = useRouter();
  const supabaseClient = useSupabaseClient<Database>();
  const userStatus = useContext(userContext);

  const [newPassword, setNewPassword] = useState<ResetPassword>({
    password: "",
    confirmPassword: "",
  });
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const arePasswordsErr: validation = validateConfirmPassword(
    newPassword.password,
    newPassword.confirmPassword
  );

  function handlePasswordChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    setIsSubmit(false);
    setNewPassword({ ...newPassword, [event.target.name]: event.target.value });
  }

  function handleSubmit(): void {
    setIsSubmit(true);

    if (!arePasswordsErr.err) {
      // reset password end point goes here
      router.push(PagePaths.successResetPassword);
    }
  }

  return (
    <>
      <Stack style={{ height: "100vh" }} alignItems="center" justifyContent="center">
        <Background />
        <Card
          sx={{
            width: "45vw",
            minWidth: "300px",
            minHeight: "200px",

            backgroundColor: grey[300],
          }}
        >
          <Stack
            spacing={3}
            sx={{
              padding: "40px",
            }}
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h1">Reset Password</Typography>

            <Box sx={{ width: "20vw", minWidth: "250px" }}>
              <PasswordTextField
                name="password"
                placeholder="New Password"
                value={newPassword.password}
                handleValueChange={handlePasswordChange}
                isErr={isSubmit && arePasswordsErr.err}
              />
            </Box>

            <Stack spacing={1} sx={{ width: "20vw", minWidth: "250px" }}>
              <PasswordTextField
                name="confirmPassword"
                placeholder="Comfirm New Password"
                value={newPassword.confirmPassword}
                handleValueChange={handlePasswordChange}
                isErr={isSubmit && arePasswordsErr.err}
              />

              <FormHelperText error>
                {isSubmit && arePasswordsErr.err && arePasswordsErr.msg}
                {"\u00A0"}
              </FormHelperText>
            </Stack>

            <Button variant="contained" onClick={handleSubmit}>
              Reset Password
            </Button>
          </Stack>
        </Card>
      </Stack>
    </>
  );
}
