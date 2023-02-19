import { Post } from "@/types/Post";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { useContext, useEffect, useState } from "react";
import { userContext } from "supabase/user_context";
import { Box, Stack, Typography } from "@mui/material";
import Loading from "@/components/public/Loading";
import { NextRouter, useRouter } from "next/router";
import { PagePaths } from "enum/pages";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminPostCard from "@/components/admin/AdminPostCard";

export default function Home() {
  const router: NextRouter = useRouter();
  const supabaseClient = useSupabaseClient<Database>();
  const userStatus = useContext(userContext);

  const [posts, setPosts] = useState<Post[] | null>(null);

  function handleDeletePost(toDeletePost: Post): void {
    setPosts(
      (posts) =>
        posts && posts.filter((post) => post.postId !== toDeletePost.postId)
    );
  }

  useEffect(() => {
    async function getPostData() {
      if (!userStatus.user) return;

      const getAllUserPostResult = await supabaseClient.rpc("get_posts");
      if (getAllUserPostResult.error) {
        console.log(getAllUserPostResult.error);
        return;
      }

      if (!getAllUserPostResult.data) return;

      setPosts(getAllUserPostResult.data.map((post) => ({
        postId: post.id,
        title: post.title,
        ownerId: post.owner_id,
        ownerName: post.owner_id,
        ownerProfilePic: post.owner_profile,
        tags: post.tag_names,
        description: post.description,
        image: post.images,
        location: post.location,
        startDateTime: post.start_time,
        endDateTime: post.end_time
      })));
    }

    getPostData();
  }, [userStatus.user, supabaseClient]);

  if (userStatus.isLoading) return <Loading />;
  if (!userStatus.user) {
    router.push(PagePaths.login);
    return;
  }
  if (
    !userStatus.user.isAdmin ||
    userStatus.user.userId !== router.query.user_id
  ) {
    router.push(PagePaths.home);
    return;
  }
  if (posts == null) return <Loading />;
  return (
    <>
      <AdminNavbar />
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
            <AdminPostCard post={item} handleDeletePost={handleDeletePost} />
          </Box>
        ))}
      </Stack>
    </>
  );
}
