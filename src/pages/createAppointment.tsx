import { useContext, useEffect, useState } from "react";
import { NextRouter, useRouter } from "next/router";
import { userContext } from "supabase/user_context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { Box, Typography } from "@mui/material";
import Loading from "@/components/public/Loading";
import Navbar from "@/components/public/Navbar";
import { Post } from "@/types/Post";
import { PAGE_PATHS } from "enum/PAGES";
import { GetCurrentUserPosts } from "@/services/Posts";
import { Grid } from "@mui/material";
import CreateAppointmentPostCard from "@/components/createAppointment/CreateAppointmentPostCard";

export default function ShowAppointment() {
  const router: NextRouter = useRouter();
  const userStatus = useContext(userContext);
  const supabaseClient = useSupabaseClient<Database>();
  const [posts, setPosts] = useState<Post[] | null>(null);

  function handleClickCard(item: Post) {
    router.push(PAGE_PATHS.CREATE_APPOINTMENT + "/" + item.postId);
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
    router.push(PAGE_PATHS.LOGIN);
    return;
  }
  if (!posts) return <Loading />;
  return (
    <>
      <Navbar />
      <Typography paddingTop="40px" variant="h4" align="center">
        Select Post To Create Appointment
      </Typography>
      <Box display="flex" justifyContent="center" padding="40px">
        <Grid container spacing="40px" width="80vw">
          {posts.map((item, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Box onClick={() => handleClickCard(item)}>
                <CreateAppointmentPostCard post={item} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
