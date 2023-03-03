import { User } from "@/types/User";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/db_types";
import { PostInfo } from "../types/Post";

export async function CreateAppointment(
  postId: number,
  post: PostInfo,
  pending_partipants: User[],
  supabaseClient: SupabaseClient<Database>
) {
  const addAppointmentResult = await supabaseClient.rpc("create_appointment", {
    postId: postId,
    title: post.title,
    location: post.location,
    description: post.description,
    tags: post.tags.map((e) => e.id),
    start_time: post.startTime.toString(),
    end_time: post.endTime.toString(),
    pending_user_id: pending_partipants.map((p) => p.userId),
    images: post.images,
    owner_id: post.userId,
  });

  if (addAppointmentResult.error) {
    console.log(addAppointmentResult.error);
    throw new Error("Something went wrong!!");
  }
}
