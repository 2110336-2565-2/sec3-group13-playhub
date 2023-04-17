import React, { useState } from "react";
import { NextRouter, useRouter } from "next/router";
import { Box, Card, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

import Loading from "@/components/public/Loading";
import Background from "@/components/public/Background";
import NormalTextField from "@/components/public/CommonTextField";
import { validateEmail } from "@/utilities/validation";

import { validation } from "@/types/Validation";
import { PAGE_PATHS } from "enum/PAGES";
import { ICONS } from "enum/ICONS";

import { Service } from "@/services";
import NormalButton from "@/components/public/CommonButton";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";

const RequestResetPasswordStyle = {
  Card: {
    width: "45vw",
    minWidth: "300px",
    minHeight: "200px",

    paddingTop: "12vh",
    paddingBottom: "6vh",

    backgroundColor: grey[300],
  },
  TextField: {
    width: "30vw",
    minWidth: "250px",
  },
};

export default function Home() {
  const supabaseClient = useSupabaseClient<Database>();
  const service = new Service(supabaseClient);
  const router: NextRouter = useRouter();

  const [email, setEmail] = useState<string>("");
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  const isEmailErr: validation = validateEmail(email);

  function handleEmailChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    setIsSubmit(false);
    setEmail(event.target.value);
  }

  async function handleSubmit() {
    setIsSubmit(true);

    if (!isEmailErr.err) {
      // reset password end point goes here
      setIsRequesting(true);
      service.password
        .RequestResetPassword(email)
        .then(() => {
          router.push(PAGE_PATHS.SUCCESS_REQUEST_RESET_PASSWORD);
          return;
        })
        .catch((err) => {
          setIsRequesting(false);
          console.log(err);
          return;
        });
    }
  }

  return (
    <>
      {isRequesting && <Loading />}
      <Stack style={{ height: "100vh" }} alignItems="center" justifyContent="center">
        <Background />
        <Card sx={RequestResetPasswordStyle.Card}>
          <Stack spacing={3} alignItems="center" justifyContent="center">
            <Stack spacing={2} alignItems="center" justifyContent="center">
              {/* header text */}
              <Typography variant="h2">Enter your email to get reset password link!</Typography>

              {/* email textfield */}
              <Box sx={RequestResetPasswordStyle.TextField}>
                <NormalTextField
                  icon={ICONS.MAIL}
                  placeholder="e.g. playhub@mail.com"
                  value={email}
                  handleValueChange={handleEmailChange}
                  isErr={isSubmit && isEmailErr.err}
                  errMsg={isEmailErr.msg}
                />
              </Box>
            </Stack>

            {/* send link button */}
            <NormalButton label="Send Link!" onClick={handleSubmit} />
          </Stack>
        </Card>
      </Stack>
    </>
  );
}
