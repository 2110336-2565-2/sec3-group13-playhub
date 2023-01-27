import * as React from "react";
import Image from "next/image";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";

import PasswordTextFeild from "@/components/PasswordTextFeild";
import EmailTextFeild from "@/components/EmailTextFeild";
import ActionButton from "@/components/ActionButton";

export default function Home() {
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
          <EmailTextFeild />
        </Grid>
        <Grid item>
          <PasswordTextFeild />
        </Grid>
        <Grid item>
          <ActionButton />
        </Grid>
        <Grid item>
          <Box sx={{ width: "20vw", minWidth: "260px" }}>
            <Link color="neutral" underline="hover" href="/register">
              Register?
            </Link>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
