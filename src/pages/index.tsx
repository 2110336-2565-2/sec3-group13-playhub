import { Suspense, useContext, useEffect, useState } from "react";

import { NextRouter, useRouter } from "next/router";

import { userContext } from "supabase/user_context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";

import { Box, Stack, Typography } from "@mui/material";

import Loading from "@/components/public/Loading";
import Navbar from "@/components/public/Navbar";
import CommonPostCard from "@/components/post/CommonPostCard";

import { Post } from "@/types/Post";
import { PAGE_PATHS } from "enum/PAGES";
import { Service } from "@/services";
import { Advertise } from "@/types/Advertisement";
import AdvertiseCard from "@/components/public/AdvertiseCard";
import { isShowAdvertise, selectAdvertise } from "@/utilities/advertise";
import { SearchPanel } from "@/components/search/SearchPanel";
import ToTop from "@/components/search/ToTop";

export default function Home() {
  const supabaseClient = useSupabaseClient<Database>();
  const service = new Service(supabaseClient);
  const router: NextRouter = useRouter();
  const userStatus = useContext(userContext);

  const [posts, setPosts] = useState<Post[] | null>(null);
  const [advertise, setAdvertise] = useState<Advertise[] | null>();

  useEffect(() => {
    async function getPostData() {
      if (!userStatus.user) return;
      service.post
        .GetPostsWithParticipants()
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
      service.advertisement
        .GetAdvertisementUrl()
        .then((p) => {
          setAdvertise(p);
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    }
    getPostData();
    getAdvertisement();
  }, [userStatus.user]);

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
        <Stack spacing={5} style={{ paddingTop: "4vh", paddingBottom: "4vh" }} alignItems="center">
          <SearchPanel setPosts={setPosts} />
          {posts?.map((item, index) => (
            <Box width="60vw" key={index}>
              <CommonPostCard post={item} userId={userStatus.user?.userId} />
              {advertise && isShowAdvertise(index, posts.length) && (
                <Box sx={{ marginTop: "50px" }}>
                  <AdvertiseCard
                    src={advertise[selectAdvertise(index, advertise.length)].image_url}
                  />
                </Box>
              )}
            </Box>
          ))}
          {posts.length == 0 && (
            <Stack alignItems="center" spacing={2} flexGrow={10} justifyContent="center">
              <Typography variant="h5">Sorry! No Post Found</Typography>
              <Typography variant="body2">Please try again with different keyword</Typography>
            </Stack>
          )}
        </Stack>
        <ToTop />
      </Suspense>
    </>
  );
}
