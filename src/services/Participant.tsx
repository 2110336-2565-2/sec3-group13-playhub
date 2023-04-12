import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/db_types";

export async function AddParticipantToPost(
  userId: string,
  postId: number,
  supabaseClient: SupabaseClient<Database>
): Promise<void> {
  const addParticipantResult = await supabaseClient.rpc("add_participant_id_to_post_id", {
    user_id: userId,
    post_id: postId,
  });
  if (addParticipantResult.error) {
    console.log(addParticipantResult.error);
    throw new Error("Something went wrong!!");
  }
}

export async function RemoveParticipantFromPost(
  userId: string,
  postId: number,
  supabaseClient: SupabaseClient<Database>
): Promise<void> {
  const removeParticipantResult = await supabaseClient.rpc("remove_participant_id_from_post_id", {
    user_id: userId,
    post_id: postId,
  });
  if (removeParticipantResult.error) {
    console.log(removeParticipantResult.error);
    throw new Error("Something went wrong!!");
  }
}
