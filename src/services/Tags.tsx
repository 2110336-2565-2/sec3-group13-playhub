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
