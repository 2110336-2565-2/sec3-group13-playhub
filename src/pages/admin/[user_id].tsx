import { Post } from "@/types/Post";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { Suspense, useContext, useEffect, useState } from "react";
import { userContext } from "supabase/user_context";
import { Box, Stack, Typography } from "@mui/material";
import Loading from "@/components/public/Loading";
import { NextRouter, useRouter } from "next/router";
import { PAGE_PATHS } from "enum/PAGES";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminPostCard from "@/components/admin/AdminPostCard";
import { GetPosts } from "@/services/Posts";

export default function Home() {
  const router: NextRouter = useRouter();
  const supabaseClient = useSupabaseClient<Database>();
  const userStatus = useContext(userContext);

  const [posts, setPosts] = useState<Post[] | null>(null);

  function handleDeletePost(toDeletePost: Post): void {
    setPosts((posts) => posts && posts.filter((post) => post.postId !== toDeletePost.postId));
  }

  useEffect(() => {
    async function getPostData() {
      if (!userStatus.user) return;

      GetPosts(supabaseClient)
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
    router.push(PAGE_PATHS.LOGIN);
    return;
  }
  if (!userStatus.user.isAdmin || userStatus.user.userId !== router.query.user_id) {
    router.push(PAGE_PATHS.HOME);
    return;
  }
  if (posts == null) return <Loading />;
  return (
    <>
      <AdminNavbar />

      <Suspense fallback={<Loading />}>
        <Stack
          spacing={5}
          style={{ paddingTop: "4vh", paddingBottom: "4vh" }}
          alignItems="center"
        >
          {posts?.map((item, index) => (
            <Box width="60vw" key={index}>
              <AdminPostCard post={item} handleDeletePost={handleDeletePost} />
            </Box>
          ))}
        </Stack>
      </Suspense>
    </>
  );
}
