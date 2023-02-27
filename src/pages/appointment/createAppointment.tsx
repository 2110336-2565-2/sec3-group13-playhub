import { useEffect, useState, useContext, ChangeEvent } from "react";
import { Dayjs } from "dayjs";

import { useRouter } from "next/router";

import { userContext } from "supabase/user_context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";

import { Grid, Typography, Button, FormHelperText, Stack, Box } from "@mui/material";

import Loading from "@/components/public/Loading";
import Navbar from "@/components/public/Navbar";
import CommonTextField from "@/components/public/CommonTextField";
import CommonDateTimePicker from "@/components/public/CommonDateTimePicker";
import Tags from "@/components/createPost/Tags";
import GoogleMap from "@/components/createPost/searchMaps";
import PictureList from "@/components/createPost/pictureList";

import { Tag } from "@/types/Tag";
import { PagePaths } from "enum/pages";
import { CHAR_LIMIT } from "enum/inputLimit";

import { validateDate, validateDateWithInterval, validateTextField } from "@/utilities/validation";
import { validation } from "@/types/Validation";
import { GetAllTags } from "@/services/Tags";
import { CreatePost } from "@/services/Posts";
import { PostInfo } from "@/types/Post";

//style
const Layout = {
  width: "35vw",
  minWidth: "300px",
  margin: "2vh 0 0 0",
};

export default function createAppointment() {
  return (
    <>
      <Navbar />
      <Box sx={Layout}>
        <Typography variant="h1">Select Post To Create Appointment</Typography>
      </Box>
      <Grid
        //spacing="40px"
        /*sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          flexDirection: "row",
          padding: "30px",
        }}*/
        container
        spacing={2}
      >
        <Grid item xs={12}></Grid>

        <Grid item xs={6}>
          uo
        </Grid>
        <Grid item xs={6}>
          4
        </Grid>
        <Grid item xs={6}>
          3
        </Grid>
        <Grid item xs={6}>
          232
        </Grid>
      </Grid>
    </>
  );
}
