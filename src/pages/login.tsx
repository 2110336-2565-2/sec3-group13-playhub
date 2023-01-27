import * as React from "react";
import Image from "next/image";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";

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
        justifyItems="center"
      >
        <Grid item xs={12}>
          <Image src="/images/logo.png" height={119} width={119} alt="Logo" />
        </Grid>
        <Grid item xs={12}>
          <EmailTextFeild />
        </Grid>
        <Grid item xs={12}>
          <PasswordTextFeild />
        </Grid>
        <Grid item xs={12}>
          <ActionButton />
        </Grid>
        <Grid item xs={2}>
          <Link href="/register">Register?</Link>
        </Grid>
      </Grid>
    </>
  );
}
