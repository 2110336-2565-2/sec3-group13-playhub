import { Box, Button, Card, FormHelperText, Stack, Typography } from "@mui/material";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { NextRouter, useRouter } from "next/router";
import { useContext, useState } from "react";
import { Database } from "supabase/db_types";
import { userContext } from "supabase/user_context";
import { grey } from "@mui/material/colors";
import PasswordTextField from "@/components/resetPassword/PasswordTextField";
import { validation } from "@/types/Validation";
import { validateConfirmPassword } from "@/utilities/validation";
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
      <Stack
        alignItems="center"
        justifyContent="center"
        style={{ height: "100vh" }}
        sx={{ backgroundColor: "primary.main" }}
      >
        <Card
          sx={{
            width: "45vw",
            backgroundColor: grey[300],
          }}
        >
          <Stack
            spacing={3}
            alignItems="center"
            justifyContent="center"
            sx={{
              padding: "40px",
            }}
          >
            <Typography variant="h1">Reset Password</Typography>

            <Box sx={{ width: "20vw" }}>
              <PasswordTextField
                name="password"
                placeholder="New Password"
                value={newPassword.password}
                handleValueChange={handlePasswordChange}
                isErr={isSubmit && arePasswordsErr.err}
              />
            </Box>

            <Stack spacing={1} sx={{ width: "20vw" }}>
              <PasswordTextField
                name="confirmPassword"
                placeholder="Comfirm New Password"
                value={newPassword.confirmPassword}
                handleValueChange={handlePasswordChange}
                isErr={isSubmit && arePasswordsErr.err}
              />
              {isSubmit && arePasswordsErr.err && (
                <FormHelperText error>{arePasswordsErr.msg}</FormHelperText>
              )}
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
