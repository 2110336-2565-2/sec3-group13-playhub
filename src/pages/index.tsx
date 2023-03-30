import { Suspense, useContext, useEffect, useState } from "react";

import { NextRouter, useRouter } from "next/router";

import { userContext } from "supabase/user_context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";

import { Box, Stack } from "@mui/material";

import Loading from "@/components/public/Loading";
import Navbar from "@/components/public/Navbar";
import CommonPostCard from "@/components/post/CommonPostCard";

import { Post } from "@/types/Post";
import { PAGE_PATHS } from "enum/PAGES";
import { GetPostsWithParticipants } from "@/services/Posts";
import { GetAdvertisementUrl } from "@/services/Advertisement";
import { Advertise } from "@/types/Advertisement";
import AdvertiseCard from "@/components/public/AdvertiseCard";
import { isShowAdvertise, selectAdvertise } from "@/utilities/advertise";

export default function Home() {
  const router: NextRouter = useRouter();
  const supabaseClient = useSupabaseClient<Database>();
  const userStatus = useContext(userContext);

  const [posts, setPosts] = useState<Post[] | null>(null);
  const [advertise, setAdvertise] = useState<Advertise[] | null>()

  useEffect(() => {
    async function getPostData() {
      if (!userStatus.user) return;
      GetPostsWithParticipants(supabaseClient)
        .then((p) => {
          setPosts(p);
        }).catch((err) => {
          console.log(err)
          return
        })
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
  if (userStatus.user.isAdmin) {
    router.push(PAGE_PATHS.ADMIN_HOME + userStatus.user.userId);
    return;
  }
  if (posts == null) return <Loading />;
  return (
    <>
      <Navbar />
      <Suspense fallback={<Loading />}>
        <Stack
          spacing="40px"
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            flexDirection: "column",
            padding: "30px",
          }}
        >
          {posts.map((item, index) => (
            <Box width="60vw" key={index}>
              <CommonPostCard
                post={item}
                userId={userStatus.user?.userId}
              />
              {advertise && isShowAdvertise(index, posts.length) &&
                <AdvertiseCard src={advertise[selectAdvertise(index, advertise.length)].image_url} />
              }
            </Box>
          ))}
        </Stack>
      </Suspense>
    </>
  );
}
