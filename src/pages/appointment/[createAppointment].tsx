import { useContext, useEffect, useState } from "react";

import { NextRouter, useRouter } from "next/router";
import Link from "next/link";

import { userContext } from "supabase/user_context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";

import { Box, Fab, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import Loading from "@/components/public/Loading";
import Navbar from "@/components/public/Navbar";
import MyPostCard from "@/components/post/MyPostCard";

import { Post } from "@/types/Post";
import { PagePaths } from "enum/pages";
import { GetCurrentUserPosts } from "@/services/Posts";
import { Grid } from "@mui/material";
import EachPostCard from "@/components/createAppointment/eachPost";
const MainLayout = {
  margin: "5vh 0 5vh 0",
  //border: "1px dashed grey",
  //textAlign: "center",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  flexDirection: "row",
  padding: "30px",
};
export default function showAppointment() {
  const router: NextRouter = useRouter();
  const userStatus = useContext(userContext);
  const supabaseClient = useSupabaseClient<Database>();
  const [posts, setPosts] = useState<Post[] | null>(null);
  useEffect(() => {
    async function getPostData() {
      if (!userStatus.user) return;
      GetCurrentUserPosts(userStatus.user, supabaseClient)
        .then((p) => {
          setPosts(p);
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    }

    getPostData();
  }, [userStatus.user, supabaseClient]);
  if (userStatus.isLoading) return <Loading />;
  if (!userStatus.user) {
    router.push(PagePaths.login);
    return;
  }
  if (posts == null) return <Loading />;
  return (
    <>
      <Navbar />
      <Box sx={MainLayout}>
        <Typography variant="h1">Select Post To Create Appointment</Typography>
      </Box>

      <Grid container spacing={2} sx={MainLayout}>
        {posts.map((item, index) => (
          <Grid
            item
            xs={6}
            key={index}
            /*sx={{
              border: "1px dashed grey",
            }}*/
          >
            <EachPostCard post={item} isLeft={index % 2 == 0} />
          </Grid>
        ))}
        {posts.length % 2 != 0 ? <Grid item xs={6}></Grid> : null}
      </Grid>
    </>
  );
}
