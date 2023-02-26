import { Appointment, AppointmentDetail, AppointmentDetailHeader } from "@/types/Appointment";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/db_types";

export async function GetAppointmentsByUserId(
    userId: string,
    supabaseClient: SupabaseClient<Database>
): Promise<Appointment[]> {
    const getAppointmentsResult = await supabaseClient.rpc("get_appointments_by_user_id", { id: userId })

    if (getAppointmentsResult.error) {
        console.log(getAppointmentsResult.error)
        throw new Error("Something went wrong!!");
    }

    return getAppointmentsResult.data.map((appointment) => (
        {
            title: appointment.title,
            ownerId: appointment.owner_id,
            ownerName: appointment.username,
            ownerProfilePic: appointment.image,
            location: appointment.location,
            startDateTime: appointment.start_time,
            endDateTime: appointment.end_time,
            participantAmount: appointment.participant_number
        }
    ));
}

export async function GetAppointmentsByAppointmentId(
    appointmentId: number,
    supabaseClient: SupabaseClient<Database>
): Promise<AppointmentDetail> {
    const getAppointmentsResult = await supabaseClient.rpc("get_appointments_by_appointment_id", { id: appointmentId })

    if (getAppointmentsResult.error) {
        console.log(getAppointmentsResult.error)
        throw new Error("Something went wrong!!");
    }

    const detailHeader: AppointmentDetailHeader = {
        title: getAppointmentsResult.data[0].title,
        location: getAppointmentsResult.data[0].location,
        startDateTime: getAppointmentsResult.data[0].start_time,
        endDateTime: getAppointmentsResult.data[0].end_time,
        tags: getAppointmentsResult.data[0].tags,
        description: getAppointmentsResult.data[0].description,
    }
    return {
        detailHeader,
        images: getAppointmentsResult.data[0].images,
        participantAmount: getAppointmentsResult.data[0].participant_number,
        pendingParticipants: getAppointmentsResult.data[0].pending_user_id,
        acceptParticipants: getAppointmentsResult.data[0].accept_user_id,
        rejectParticipants: getAppointmentsResult.data[0].reject_user_id
    }

}