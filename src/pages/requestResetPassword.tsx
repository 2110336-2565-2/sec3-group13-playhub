import EmailTextField from "@/components/requestResetPassword/EmailTextField";
import { validation } from "@/types/Validation";
import { validateEmail } from "@/utilities/validation";
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { PagePaths } from "enum/pages";
import { NextRouter, useRouter } from "next/router";
import { useContext, useState } from "react";
import { Database } from "supabase/db_types";
import { userContext } from "supabase/user_context";

export default function Home() {
  const router: NextRouter = useRouter();
  const supabaseClient = useSupabaseClient<Database>();
  const userStatus = useContext(userContext);

  const [email, setEmail] = useState<string>("");
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const isEmailErr: validation = validateEmail(email);

  function handleEmailChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    setIsSubmit(false);
    setEmail(event.target.value);
  }

  function handleSubmit(): void {
    setIsSubmit(true);

    if (!isEmailErr.err) {
      // reset password end point goes here
      router.push(PagePaths.successRequestResetPassword);
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
            width: "40vw",
            backgroundColor: grey[300],
            paddingTop: "100px",
            paddingBottom: "50px",
          }}
        >
          <Stack spacing={3} alignItems="center" justifyContent="center">
            <Stack spacing={2}>
              <Typography variant="h1">Enter your email to get reset password link!</Typography>
              <Box sx={{ width: "30vw" }}>
                <EmailTextField
                  placeholder="e.g. playhub@mail.com"
                  value={email}
                  handleValueChange={handleEmailChange}
                  isErr={isSubmit && isEmailErr.err}
                  errMsg={isEmailErr.msg}
                />
              </Box>
            </Stack>

            <Button variant="contained" onClick={handleSubmit}>
              Send Link!
            </Button>
          </Stack>
        </Card>
      </Stack>
    </>
  );
}
