import { AppointmentInfo } from "@/types/Appointment";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/db_types";

export async function CreateAppointment(
  newAppointment: AppointmentInfo,
  supabaseClient: SupabaseClient<Database>
) {
  const now = Date.now();
  let index = 0;
  let images: string[] = [];
  for (const e of newAppointment.images) {
    const filePath = newAppointment.userId + index.toString() + now.toString();
    const fileBlob = await fetch(e).then((r) => r.blob());
    const uploadResult = await supabaseClient.storage
      .from("locationimage")
      .upload(filePath, fileBlob);
    if (uploadResult.error) return;
    const imageUrlResult = supabaseClient.storage.from("locationimage").getPublicUrl(filePath);
    images.push(imageUrlResult.data.publicUrl);
    index += 1;
  }

  const addAppointmentResult = await supabaseClient.rpc("create_appointment", {
    title: newAppointment.title,
    location: newAppointment.location,
    description: newAppointment.description,
    owner_id: newAppointment.userId,
    start_time: newAppointment.startTime.toString(),
    end_time: newAppointment.endTime.toString(),
    tags: newAppointment.tags.map((e) => e.id),
    images: images,
    pending_user_id: newAppointment.selectedUsers,
    accept_user_id: [],
    reject_user_id: [],
  });

  if (addAppointmentResult.error) {
    console.log(addAppointmentResult.error);
    throw new Error("Something went wrong!!");
  }
}
