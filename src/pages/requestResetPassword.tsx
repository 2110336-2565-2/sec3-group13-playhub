import { useContext, useState } from "react";
import { NextRouter, useRouter } from "next/router";
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { userContext } from "supabase/user_context";

import Background from "@/components/public/Background";
import EmailTextField from "@/components/requestResetPassword/EmailTextField";
import { validateEmail } from "@/utilities/validation";

import { validation } from "@/types/Validation";
import { PagePaths } from "enum/pages";

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
      <Stack style={{ height: "100vh" }} alignItems="center" justifyContent="center">
        <Background />
        <Card
          sx={{
            width: "45vw",
            minWidth: "300px",
            minHeight: "200px",

            paddingTop: "12vh",
            paddingBottom: "6vh",

            backgroundColor: grey[300],
          }}
        >
          <Stack spacing={3} alignItems="center" justifyContent="center">
            <Stack spacing={2} alignItems="center" justifyContent="center">
              {/* header text */}
              <Typography variant="h1">Enter your email to get reset password link!</Typography>

              {/* email textfield */}
              <Box sx={{ width: "30vw", minWidth: "250px" }}>
                <EmailTextField
                  placeholder="e.g. playhub@mail.com"
                  value={email}
                  handleValueChange={handleEmailChange}
                  isErr={isSubmit && isEmailErr.err}
                  errMsg={isEmailErr.msg}
                />
              </Box>
            </Stack>

            {/* send link button */}
            <Button variant="contained" onClick={handleSubmit}>
              Send Link!
            </Button>
          </Stack>
        </Card>
      </Stack>
    </>
  );
}
