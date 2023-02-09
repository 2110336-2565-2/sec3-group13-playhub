import PostCard from "@/components/post/PostCard";
import Navbar from "@/components/public/Navbar";
import { Post } from "@/types/Post";
import { alignProperty } from "@mui/material/styles/cssUtils";
import Typography from "@mui/material/Typography";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/db_types";
import { useContext, useEffect, useState } from "react";
import { userContext } from "supabase/user_context";

export default function Home() {
  const supabaseClient = useSupabaseClient<Database>();
  const userStatus = useContext(userContext);

  const [posts, setPosts] = useState<Post[]|null>(null);

  useEffect(() => {
    async function getPostData(){
      if(userStatus.user == null) return;

      const getPostDataResult = await supabaseClient.from("Post").select("id, title, description, owner_id, location, start_time, end_time");
      if(getPostDataResult.error != null){
        console.log(getPostDataResult.error);
        return ;
      }
      
      const getAllUserPostResult = await supabaseClient.rpc('get_all_user_post', {target_id:userStatus.user.user_id})
      if(getAllUserPostResult.error != null){
        console.log(getAllUserPostResult.error) ;
        return ;
      }
      
      if(getAllUserPostResult.data == null) return ;
      
      const getPostTagResult = await supabaseClient.rpc('get_all_post_tag')
      if(getPostTagResult.error != null){
        console.log(getPostTagResult.error);
        return ;
      }
      
      if(getPostTagResult.data == null) return ;
      const postDataList = getAllUserPostResult.data.map((data) => {
        const postTagList = getPostTagResult.data.filter(post => post.post_id == data.post_id);
        const tagName = postTagList.map(data => data.name)

        return {
              title: data.title,
              ownerName: data.username,
              ownerProfilePic: data.profile_image,
              tags: tagName,
              description: data.description,
              image: [""],
              location: data.location,
              time: data.start_time,
        }
      })

      setPosts(postDataList);
    };

    getPostData();

  }, [userStatus.user])

  if(posts == null) return <p>Loading All Post...</p>
  return (
    <>
      <Navbar />
      <div style={{ display: "flex", alignItems: "center", width: "100%", flexDirection: "column" }}>
        <Typography variant="h1" sx={{ marginTop: "30px" }}>
          My post
        </Typography>
        {posts.map((item, index) => (
          <PostCard key={index} {...item} />
        ))}
      </div>
    </>
  );
}
