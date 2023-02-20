import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/db_types";

export async function AcceptAppointment(
  appointmentId: number,
  userId: string,
  supabaseClient: SupabaseClient<Database>
): Promise<void> {
  const acceptAppointmentResult = await supabaseClient.rpc(
    "update_accept_appointment_by_appointment_id",
    {
      id: appointmentId,
      user_id: userId,
    }
  );
  if (acceptAppointmentResult.error) {
    console.log(acceptAppointmentResult.error);
    throw new Error("Something went wrong!!");
  }
}

export async function RejectAppointment(
  appointmentId: number,
  userId: string,
  supabaseClient: SupabaseClient<Database>
): Promise<void> {
  const rejectAppointmentResult = await supabaseClient.rpc(
    "update_reject_appointment_by_appointment_id",
    {
      id: appointmentId,
      user_id: userId,
    }
  );
  if (rejectAppointmentResult.error) {
    console.log(rejectAppointmentResult.error);
    throw new Error("Something went wrong!!");
  }
}
