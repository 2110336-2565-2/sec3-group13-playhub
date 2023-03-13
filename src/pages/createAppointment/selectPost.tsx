import { useContext, useEffect, useState } from "react";
import { NextRouter, useRouter } from "next/router";
import { userContext } from "supabase/user_context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { Box, Typography } from "@mui/material";
import Loading from "@/components/public/Loading";
import Navbar from "@/components/public/Navbar";
import { Post } from "@/types/Post";
import { PagePaths } from "enum/pages";
import { GetCurrentUserPosts } from "@/services/Posts";
import { Grid } from "@mui/material";
import CreateAppointmentPostCard from "@/components/createAppointment/CreateAppointmentPostCard";

const MainLayout = {
  margin: "1vh 0 0 0",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  flexDirection: "row",
  padding: "30px",
};

export default function ShowAppointment() {
  const router: NextRouter = useRouter();
  const userStatus = useContext(userContext);
  const supabaseClient = useSupabaseClient<Database>();
  const [posts, setPosts] = useState<Post[] | null>(null);

  function handleClickCard(item: Post) {
    router.push(PagePaths.createAppointment + "/" + item.postId);
  }

  useEffect(() => {
    if (!userStatus.user) return;
    GetCurrentUserPosts(userStatus.user, supabaseClient)
      .then((p) => {
        setPosts(p);
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  }, [userStatus.user, supabaseClient]);

  if (userStatus.isLoading) return <Loading />;
  if (!userStatus.user) {
    router.push(PagePaths.login);
    return;
  }
  if (!posts) return <Loading />;
  return (
    <>
      <Navbar />
      {/*  Title */}
      <Box sx={MainLayout}>
        <Typography variant="h1" sx={{ fontWeight: "700", fontSize: "40px" }}>
          Select Post To Create Appointment
        </Typography>
      </Box>
      {/*  CreateAppointmentPostCard */}
      <Grid container spacing={2} sx={MainLayout}>
        {posts.map((item, index) => (
          <Grid item xs={6} key={index}>
            <Box onClick={() => handleClickCard(item)}>
              <CreateAppointmentPostCard post={item} isLeft={index % 2 == 0} />
            </Box>
          </Grid>
        ))}
        {posts.length % 2 != 0 ? <Grid item xs={6}></Grid> : null}
      </Grid>
    </>
  );
}
