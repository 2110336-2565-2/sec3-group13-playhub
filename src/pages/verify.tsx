import { useContext } from "react";
import Navbar from "@/components/public/Navbar";
import Loading from "@/components/public/Loading";

import Link from "next/link";
import { NextRouter, useRouter } from "next/router";

import { Typography, Stack, Box } from "@mui/material";
import { PAGE_PATHS } from "enum/PAGES";

import { userContext } from "supabase/user_context";
import VerifyChip from "@/components/profile/VerifyChip";

export default function Verify() {
  const router: NextRouter = useRouter();
  const userStatus = useContext(userContext);

  if (userStatus.isLoading) return <Loading />;
  if (!userStatus.user) {
    router.push(PAGE_PATHS.LOGIN);
    return;
  }
  if (userStatus.user.isVerified) {
    router.push(PAGE_PATHS.HOME);
    return;
  }

  const newLine: string = "%0D%0A";
  const emailToAdmin: string = `mailto:${process.env.NEXT_PUBLIC_ADMIN_EMAIL}
    ?subject=Verify ${userStatus.user.email} PlayHub account
    &body=รายละเอียดบัญชี${newLine}
    Email account : ${userStatus.user.email}${newLine}
    Profile link : ${
      process.env.NEXT_PUBLIC_DOMAIN_NAME + PAGE_PATHS.PROFILE + userStatus.user.userId
    }${newLine}
    ${newLine}โปรดแนบ รูปถ่ายบัตรประจำตัวประชาชน`;

  return (
    <>
      <Navbar />
      <Stack
        spacing={8}
        width="45vw"
        minWidth="270px"
        minHeight="90vh"
        justifyContent="center"
        sx={{
          margin: "auto",
        }}
      >
        <Stack spacing={2}>
          <Typography gutterBottom variant="h2" align="center">
            What is
            <Typography gutterBottom display="inline" variant="h2" color="primary">
              {"\u00A0"}Verify{"\u00A0"}
            </Typography>
            ?
          </Typography>

          <Typography variant="body1" align="center" style={{ lineHeight: "40px" }}>
            <Typography display="inline" color="primary">
              Verify{"\u00A0"}
            </Typography>
            is an authentication system to provide security for you and PlayHub members who use our
            website, as well as receive special privileges from PlayHub.
          </Typography>
        </Stack>

        <Stack spacing={2}>
          <Typography gutterBottom variant="h2">
            What
            <Typography gutterBottom display="inline" variant="h2" color="primary">
              {"\u00A0"}Verify{"\u00A0"}
            </Typography>
            gives you
          </Typography>
          <Box display="flex" justifyContent="center">
            <Typography variant="body1" align="left" style={{ lineHeight: "40px" }}>
              <Box>1. You will be able to create activity post to find friends to join you.</Box>
              <Box>2. You will receive a cool identity badge on your profile.</Box>
            </Typography>
          </Box>
        </Stack>

        <Stack spacing={2}>
          <Typography gutterBottom variant="h2" align="center">
            How to
            <Typography gutterBottom display="inline" variant="h2" color="primary">
              {"\u00A0"}Verify{"\u00A0"}
            </Typography>
            ?
          </Typography>

          <Typography variant="body1" align="center" style={{ lineHeight: "40px" }}>
            Attach
            <Typography display="inline" variant="body1" color="error">
              {"\u00A0"}national ID card photo{"\u00A0"}
            </Typography>
            to this{"\u00A0"}
            <Link href={emailToAdmin} style={{ color: "blue", textDecorationLine: "underline" }}>
              email
            </Link>
            {"\u00A0"}and wait for verification around 1 week. If you pass the verification, this
            badge
            {"\u00A0"}
            <VerifyChip />
            {"\u00A0"}would be appear in your profile page.
          </Typography>
        </Stack>
      </Stack>
    </>
  );
}
