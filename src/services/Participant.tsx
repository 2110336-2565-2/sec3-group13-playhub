import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/db_types";

export class ParticipantService {
  supabaseClient: SupabaseClient<Database>;

  constructor(supabaseClient: SupabaseClient<Database>) {
    this.supabaseClient = supabaseClient;
  }

  async AddParticipantToPost(userId: string, postId: number): Promise<void> {
    const addParticipantResult = await this.supabaseClient.rpc("add_participant_id_to_post_id", {
      user_id: userId,
      post_id: postId,
    });
    if (addParticipantResult.error) {
      console.log(addParticipantResult.error);
      throw new Error("Something went wrong!!");
    }
  }

  async RemoveParticipantFromPost(userId: string, postId: number): Promise<void> {
    const removeParticipantResult = await this.supabaseClient.rpc(
      "remove_participant_id_from_post_id",
      {
        user_id: userId,
        post_id: postId,
      }
    );
    if (removeParticipantResult.error) {
      console.log(removeParticipantResult.error);
      throw new Error("Something went wrong!!");
    }
  }
}
