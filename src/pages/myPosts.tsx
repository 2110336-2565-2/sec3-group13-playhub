import { useContext, useEffect, useState } from "react";
import { NextRouter, useRouter } from "next/router";
import Link from "next/link";

import { userContext } from "supabase/user_context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { Box, Fab, Grid, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import Loading from "@/components/public/Loading";
import Navbar from "@/components/public/Navbar";
import MyPostCard from "@/components/post/MyPostCard";

import { Post } from "@/types/Post";
import { PAGE_PATHS } from "enum/PAGES";

import { GetCurrentUserPosts } from "@/services/Posts";
import AdvertiseCard from "@/components/public/AdvertiseCard";
import { Advertise } from "@/types/Advertisement";
import { GetAdvertisementUrl } from "@/services/Advertisement";
import { isShowAdvertise, selectAdvertise } from "@/utilities/advertise";

export default function Home() {
  const router: NextRouter = useRouter();
  const userStatus = useContext(userContext);
  const supabaseClient = useSupabaseClient<Database>();

  const [posts, setPosts] = useState<Post[] | null>(null);
  const [advertise, setAdvertise] = useState<Advertise[] | null>(null);

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
    async function getAdvertisement() {
      if (!userStatus.user) return;
      GetAdvertisementUrl(supabaseClient)
        .then((p) => {
          setAdvertise(p)
          console.log(p)
        }).catch((err) => {
          console.log(err)
          return
        })
    }
    getPostData();
    getAdvertisement();
  }, [userStatus.user, supabaseClient]);

  if (userStatus.isLoading) return <Loading />;
  if (!userStatus.user) {
    router.push(PAGE_PATHS.LOGIN);
    return;
  }
  if (!userStatus.user.isVerified) {
    router.push(PAGE_PATHS.HOME)
    return;
  }
  if (!userStatus.user.isVerified) {
    router.push(PAGE_PATHS.HOME)
    return;
  }
  if (posts == null) return <Loading />;
  return (
    <>
      <Navbar />

      <Stack spacing={4} alignItems="center">
        {/* Page header */}
        <Box sx={{ marginTop: "3vh" }}>
          <Typography variant="h1">My post</Typography>
        </Box>
        <Grid
          container
          justifyContent="space-between"
          rowSpacing={6}
          style={{ width: "80vw", marginTop: -6, marginBottom: "30px" }}
        >
          {posts.map((item, index) => (
            <>
              <Grid item key={index} xs={5.75}>
                <MyPostCard post={item} />
              </Grid>
              {advertise && isShowAdvertise(index, posts.length) &&
                <Box sx={{ width: "100%", marginTop: "50px" }}>
                  <AdvertiseCard src={advertise[selectAdvertise(index, advertise.length)].image_url} />
                </Box>
              }
            </>
          ))}
        </Grid >
      </Stack>

      {userStatus.user.isVerified && (
        <Link href={"createPost"} color="inherit">
          <Fab
            color="primary"
            aria-label="add"
            sx={{
              position: "fixed",
              right: "20px",
              bottom: "20px",
              borderRadius: "15px",
              border: "3px #000000 solid",
            }}
          >
            <AddIcon fontSize="large" />
          </Fab>
        </Link>
      )}
    </>
  );
}
