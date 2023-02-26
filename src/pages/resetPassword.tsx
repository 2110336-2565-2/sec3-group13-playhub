import { useContext, useState, useEffect } from "react";
import { NextRouter, useRouter } from "next/router";
import { Box, Button, Card, FormHelperText, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { userContext } from "supabase/user_context";

import Background from "@/components/public/Background";
import PasswordTextField from "@/components/resetPassword/PasswordTextField";
import { validateConfirmNewPassword } from "@/utilities/validation";

import { validation } from "@/types/Validation";
import { PagePaths } from "enum/pages";
import Loading from "@/components/public/Loading";
import { ResetPassword } from "@/services/Password";

type ResetPassword = {
  password: string;
  confirmPassword: string;
};

export default function Home() {
  const router: NextRouter = useRouter();
  const supabaseClient = useSupabaseClient<Database>();
  const userStatus = useContext(userContext);
  const [canResetPassword, setCanResetPassword] = useState(false);

  const [newPassword, setNewPassword] = useState<ResetPassword>({
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

  async function handleSubmit() {
    setIsSubmit(true);

    if (!arePasswordsErr.err) {
      // reset password end point goes here
      setIsRequesting(true);
      ResetPassword(newPassword.password, supabaseClient)
        .then(() => {
          router.push(PagePaths.successResetPassword);
        })
        .catch((err) => {
          setIsRequesting(false);
          console.log(err);
          return;
        });
    }
  }

  useEffect(() => {
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        setCanResetPassword(true);
      }
    });
  }, []);

  useEffect(() => {
    if (router.asPath.indexOf("error") != -1) {
      router.push(PagePaths.requestResetPassword);
    }
  }, [router]);
  if (!canResetPassword) return <Loading />;
  return (
    <>
      {isRequesting && <Loading />}
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
