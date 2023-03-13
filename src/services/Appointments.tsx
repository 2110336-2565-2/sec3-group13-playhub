import { Appointment, AppointmentDetail, AppointmentDetailHeader } from "@/types/Appointment";
import { SupabaseClient } from "@supabase/supabase-js";
import dayjs from "dayjs";
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
): Promise<Appointment[]> {
  const GetAppointmentsResult = await supabaseClient.rpc("get_appointments");

  if (GetAppointmentsResult.error) {
    console.log(GetAppointmentsResult.error);
    throw new Error("Something went wrong!!");
  }

  return GetAppointmentsResult.data.map((appointment) => ({
    appointmentId: appointment.id,
    title: appointment.title,
    ownerId: appointment.owner_id,
    ownerName: appointment.username,
    ownerProfilePic: appointment.image,
    location: appointment.location,
    startDateTime: appointment.start_time,
    endDateTime: appointment.end_time,
    participantAmount: appointment.participant_number,
  }));
}

export async function GetAppointmentsByAppointmentId(
  appointmentId: number,
  supabaseClient: SupabaseClient<Database>
): Promise<AppointmentDetail> {
  const getAppointmentsResult = await supabaseClient.rpc("get_appointments_by_appointment_id", {
    id: appointmentId,
  });

  if (getAppointmentsResult.error) {
    console.log(getAppointmentsResult.error);
    throw new Error("Something went wrong!!");
  }

  const hostIndex = getAppointmentsResult.data[0].accept_user_names.indexOf(
    getAppointmentsResult.data[0].username
  );
  [
    getAppointmentsResult.data[0].accept_user_names[0],
    getAppointmentsResult.data[0].accept_user_names[hostIndex],
  ] = [
    getAppointmentsResult.data[0].accept_user_names[hostIndex],
    getAppointmentsResult.data[0].accept_user_names[0],
  ];

  const detailHeader: AppointmentDetailHeader = {
    title: getAppointmentsResult.data[0].title,
    location: getAppointmentsResult.data[0].location,
    startDateTime: dayjs(getAppointmentsResult.data[0].start_time),
    endDateTime: dayjs(getAppointmentsResult.data[0].end_time),
    tags: getAppointmentsResult.data[0].tags,
    description: getAppointmentsResult.data[0].description,
  };
  return {
    detailHeader,
    ownerId: getAppointmentsResult.data[0].owner_id,
    images: getAppointmentsResult.data[0].images,
    participantAmount: getAppointmentsResult.data[0].participant_number,
    pendingParticipants: getAppointmentsResult.data[0].pending_user_names,
    acceptParticipants: getAppointmentsResult.data[0].accept_user_names,
    rejectParticipants: getAppointmentsResult.data[0].reject_user_names,
  };
}

export async function GetAppointmentsByUserIdWhichPending(
  userId: string,
  supabaseClient: SupabaseClient<Database>
): Promise<Appointment[]> {
  const getAppointmentsResult = await supabaseClient.rpc(
    "get_appointments_by_user_id_which_pending",
    {
      id: userId,
    }
  );

  if (getAppointmentsResult.error) {
    console.log(getAppointmentsResult.error);
    throw new Error("Something went wrong!!");
  }

  return getAppointmentsResult.data.map((appointment) => ({
    appointmentId: appointment.id,
    title: appointment.title,
    ownerId: appointment.owner_id,
    ownerName: appointment.username,
    ownerProfilePic: appointment.image,
    location: appointment.location,
    startDateTime: dayjs(appointment.start_time),
    endDateTime: dayjs(appointment.end_time),
    participantAmount: appointment.participant_number,
  }));
}
