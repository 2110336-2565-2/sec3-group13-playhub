import { Post } from "@/types/Post";
import { Tag } from "@/types/Tag";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/db_types";
import { dayjsWithoutTZ } from "./Posts";

export async function SearchPostByConditions(
  tagIds: number[],
  hostNames: string[],
  postNames: string[],
  supabaseClient: SupabaseClient<Database>
): Promise<Post[]> {
  const searchResult = await supabaseClient.rpc("search_posts_by_conditions", {
    tag_ids: tagIds,
    host_names: hostNames,
    post_names: postNames,
  });

  if (searchResult.error) {
    throw new Error("Something went wrong!!");
  }

  return searchResult.data.map((post) => ({
    postId: post.id,
    title: post.title,
    ownerId: post.owner_id,
    ownerName: post.owner_name,
    ownerProfilePic: post.owner_profile,
    location: post.location,
    tags: post.tags.map((tag: Tag) => tag.name),
    description: post.description,
    image: post.images,
    startDateTime: dayjsWithoutTZ(post.end_time).format("DD/MM/YYYY hh:mm A"),
    endDateTime: dayjsWithoutTZ(post.end_time).format("DD/MM/YYYY hh:mm A"),
    participants: post.participants.map((user: any) => ({
      userId: user.id,
      username: user.username,
      sex: user.sex,
      birthdate: user.birthdate,
      description: user.description,
      image: user.image,
      email: "",
      isAdmin: false,
      isVerified: user.is_verified,
    })),
  }));
}
