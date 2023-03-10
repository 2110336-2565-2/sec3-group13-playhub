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
import { PagePaths } from "enum/pages";
import { GetPosts } from "@/services/Posts";

export default function Home() {
  const router: NextRouter = useRouter();
  const supabaseClient = useSupabaseClient<Database>();
  const userStatus = useContext(userContext);

  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    async function getPostData() {
      if (!userStatus.user) return;
      GetPosts(supabaseClient)
      .then((p) => {
        setPosts(p);
      }).catch((err) => {
        console.log(err)
        return
      })
    }
    getPostData();
  }, [userStatus.user, supabaseClient]);

  if (userStatus.isLoading) return <Loading />;
  if (!userStatus.user) {
    router.push(PagePaths.login);
    return;
  }
  if (userStatus.user.isAdmin) {
    router.push(PagePaths.adminHome + userStatus.user.userId);
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
          {posts?.map((item, index) => (
            <Box width="60vw" key={index}>
              <CommonPostCard post={item} />
            </Box>
          ))}
        </Stack>
      </Suspense>
    </>
  );
}
