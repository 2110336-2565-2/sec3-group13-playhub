import PostCard from "@/components/post/PostCard";
import Navbar from "@/components/public/Navbar";
import { Post } from "@/types/Post";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { useContext, useEffect, useState } from "react";
import { userContext } from "supabase/user_context";
import { Box, Stack, Typography } from "@mui/material";

export default function Home() {
  const supabaseClient = useSupabaseClient<Database>();
  const userStatus = useContext(userContext);

  const [posts, setPosts] = useState<Post[] | null>(null);

  function handleDeletePost(toDeletePost: Post): void {
    setPosts((posts) => posts && posts.filter((post) => post.post_id !== toDeletePost.post_id));
  }

  useEffect(() => {
    async function getPostData() {
      if (!userStatus.user) return;

      const getAllUserPostResult = await supabaseClient.rpc("get_all_user_post", {
        target_id: userStatus.user.user_id,
      });
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

      const getPostLocationImgResult = await supabaseClient.rpc("get_all_post_location_image");
      if (getPostLocationImgResult.error) {
        console.log(getPostLocationImgResult.error);
        return;
      }

      const postDataList = getAllUserPostResult.data.map((data) => {
        // extract tags from post data
        const postTagList = getPostTagResult.data.filter((post) => post.post_id == data.post_id);
        const tagName = postTagList.map((data) => data.name);

        // extract image from post data
        const postLocationImgList = getPostLocationImgResult.data.filter(
          (post) => post.post_id == data.post_id
        );
        const imageURL = postLocationImgList.map((data) => data.image);

        return {
          post_id: data.post_id,
          title: data.title,
          ownerName: data.username,
          ownerProfilePic: data.profile_image,
          tags: tagName,
          description: data.description,
          image: imageURL,
          location: data.location,
          time: data.start_time,
        };
      });

      setPosts(postDataList);
    }

    getPostData();
  }, [userStatus.user]);

  if (posts == null) return <p>Loading All Post...</p>;
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
          <Box width="80vw">
            <PostCard key={index} post={item} handleDeletePost={handleDeletePost} />
          </Box>
        ))}
      </Stack>
    </>
  );
}
