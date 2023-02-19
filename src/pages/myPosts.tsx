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

export default function Home() {
  const router: NextRouter = useRouter();
  const userStatus = useContext(userContext);
  const supabaseClient = useSupabaseClient<Database>();

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

      const getAllUserPostResult = await supabaseClient.rpc(
        "get_posts_by_user_id",
        {
          id: userStatus.user.userId,
        }
      );
      if (getAllUserPostResult.error) {
        console.log(getAllUserPostResult.error);
        return;
      }

      if (!getAllUserPostResult.data) return;

      setPosts(getAllUserPostResult.data.map((post) => ({
        postId: post.id,
        title: post.title,
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
  if (posts == null) return <Loading />;
  return (
    <>
      <Navbar />
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
        <Typography variant="h1">My post</Typography>

        {posts.map((item, index) => (
          <Box width="60vw" key={index}>
            <MyPostCard post={item} handleDeletePost={handleDeletePost} />
          </Box>
        ))}
      </Stack>
      <Link href={"createPost"} color="inherit">
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: "fixed", right: "20px", bottom: "20px" }}
        >
          <AddIcon />
        </Fab>
      </Link>
    </>
  );
}
