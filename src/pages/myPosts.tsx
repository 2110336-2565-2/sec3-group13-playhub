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
        posts && posts.filter((post) => post.post_id !== toDeletePost.post_id)
    );
  }

  useEffect(() => {
    async function getPostData() {
      if (!userStatus.user) return;

      const getAllUserPostResult = await supabaseClient.rpc(
        "get_posts_by_user_id",
        {
          target_id: userStatus.user.user_id,
        }
      );
      if (getAllUserPostResult.error) {
        console.log(getAllUserPostResult.error);
        return;
      }

      if (!getAllUserPostResult.data) return;

      const getPostTagResult = await supabaseClient.rpc("get_all_post_tag");
      if (getPostTagResult.error) {
        console.log(getPostTagResult.error);
        return;
      }

      if (!getPostTagResult.data) return;

      const getPostLocationImgResult = await supabaseClient.rpc(
        "get_all_post_location_image"
      );
      if (getPostLocationImgResult.error) {
        console.log(getPostLocationImgResult.error);
        return;
      }

      const postDataList = getAllUserPostResult.data.map((data) => {
        // extract tags from post data
        const postTagList = getPostTagResult.data.filter(
          (post) => post.post_id == data.post_id
        );
        const tagName = postTagList.map((data) => data.name);

        // extract image from post data
        const postLocationImgList = getPostLocationImgResult.data.filter(
          (post) => post.post_id == data.post_id
        );
        const imageURL = postLocationImgList.map((data) => data.image);

        return {
          post_id: data.post_id,
          title: data.title,
          user_id: data.user_id,
          ownerName: data.username,
          ownerProfilePic: data.profile_image,
          tags: tagName,
          description: data.description,
          image: imageURL,
          location: data.location,
          startDateTime: data.start_time,
          endDateTime: data.end_time,
        };
      });

      setPosts(postDataList);
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
