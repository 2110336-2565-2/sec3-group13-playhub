import { Appointment } from "@/types/Appointment";
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

export async function GetAppointments(
  supabaseClient: SupabaseClient<Database>
): Promise<Appointment[]>{
  const GetAppointmentsResult = await supabaseClient.rpc("get_appointments") ;

  if (GetAppointmentsResult.error) {
    console.log(GetAppointmentsResult.error);
    throw new Error("Something went wrong!!");
  }

  return GetAppointmentsResult.data.map((appointment) => ({
    title: appointment.title,
    ownerId: appointment.owner_id,
    ownerName: appointment.username,
    ownerProfilePic: appointment.image,
    location: appointment.location,
    startDateTime: appointment.start_time,
    endDateTime: appointment.end_time,
    participantAmount: appointment.participant_number
  }))
}
