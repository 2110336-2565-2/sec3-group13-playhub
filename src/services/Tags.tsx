import { SUPABASE_CONNECTING_ERROR } from "@/constants/supabase";
import { Tag } from "@/types/Tag";
import { SupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";

export async function GetAllTags(
  supabaseClient: SupabaseClient<Database, "public", any>
): Promise<Tag[]> {
  const getTagsResult = await supabaseClient.rpc("get_tags");
  if (getTagsResult.error) {
    console.log(getTagsResult.error);
    throw new Error(SUPABASE_CONNECTING_ERROR);
  }
  return getTagsResult.data;
}

export async function GetTagsByPost(
  postId: number,
  supabaseClient: SupabaseClient<Database, "public", any>
): Promise<Tag[]> {
  const getSelectedTagResult = await supabaseClient.rpc("get_all_post_tag");
  if (getSelectedTagResult.error) {
    console.log(getSelectedTagResult.error);
    throw new Error(SUPABASE_CONNECTING_ERROR);
  }
  return getSelectedTagResult.data.filter((data) => data.post_id == postId);
}
