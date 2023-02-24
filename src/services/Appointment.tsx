import { Appointment } from "@/types/Appointment";
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