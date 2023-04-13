import { Appointment, AppointmentDetail, AppointmentDetailHeader } from "@/types/Appointment";
import { SupabaseClient } from "@supabase/supabase-js";
import dayjs from "dayjs";
import { Database } from "supabase/db_types";
import { PostInfo } from "../types/Post";
import { User } from "@/types/User";

export class AppointmentService {
  supabaseClient: SupabaseClient<Database>;

  constructor(supabaseClient: SupabaseClient<Database>) {
    this.supabaseClient = supabaseClient;
  }

  async CreateAppointment(
    postId: number,
    post: PostInfo,
    pending_partipants: User[]
  ): Promise<void> {
    const addAppointmentResult = await this.supabaseClient.rpc("create_appointment", {
      postid: postId,
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

    return;
  }

  async AcceptAppointment(appointmentId: number, userId: string): Promise<void> {
    const acceptAppointmentResult = await this.supabaseClient.rpc(
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

  async RejectAppointment(appointmentId: number, userId: string): Promise<void> {
    const rejectAppointmentResult = await this.supabaseClient.rpc(
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

  async GetAppointments(): Promise<Appointment[]> {
    const getAppointmentsResult = await this.supabaseClient.rpc("get_appointments");

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
      startDateTime: dayjs(appointment.start_time).format("DD/MM/YYYY hh:mm A"),
      endDateTime: dayjs(appointment.end_time).format("DD/MM/YYYY hh:mm A"),
      participantAmount: appointment.participant_number,
    }));
  }

  async GetAppointmentsByUserIdWhichPending(userId: string): Promise<Appointment[]> {
    const getAppointmentsResult = await this.supabaseClient.rpc(
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
      startDateTime: dayjs(appointment.start_time).format("DD/MM/YYYY hh:mm A"),
      endDateTime: dayjs(appointment.end_time).format("DD/MM/YYYY hh:mm A"),
      participantAmount: appointment.participant_number,
    }));
  }

  async GetAppointmentsByUserId(userId: string): Promise<Appointment[]> {
    const getAppointmentsResult = await this.supabaseClient.rpc("get_appointments_by_user_id", {
      id: userId,
    });

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
      startDateTime: dayjs(appointment.start_time).format("DD/MM/YYYY hh:mm A"),
      endDateTime: dayjs(appointment.end_time).format("DD/MM/YYYY hh:mm A"),
      participantAmount: appointment.participant_number,
    }));
  }

  async GetAppointmentByAppointmentId(appointmentId: number): Promise<AppointmentDetail> {
    const getAppointmentsResult = await this.supabaseClient.rpc(
      "get_appointment_by_appointment_id",
      {
        id: appointmentId,
      }
    );

    if (getAppointmentsResult.error) {
      console.log(getAppointmentsResult.error);
      throw new Error("Something went wrong!!");
    }

    const accept_user_ids = getAppointmentsResult.data[0].accept_user.map((user: any) => user.id);
    const hostIndex = accept_user_ids.indexOf(getAppointmentsResult.data[0].owner_id);
    [
      getAppointmentsResult.data[0].accept_user[0],
      getAppointmentsResult.data[0].accept_user[hostIndex],
    ] = [
      getAppointmentsResult.data[0].accept_user[hostIndex],
      getAppointmentsResult.data[0].accept_user[0],
    ];

    const detailHeader: AppointmentDetailHeader = {
      title: getAppointmentsResult.data[0].title,
      location: getAppointmentsResult.data[0].location,
      startDateTime: dayjs(getAppointmentsResult.data[0].start_time).format("DD/MM/YYYY hh:mm A"),
      endDateTime: dayjs(getAppointmentsResult.data[0].end_time).format("DD/MM/YYYY hh:mm A"),
      tags: getAppointmentsResult.data[0].tags,
      description: getAppointmentsResult.data[0].description,
    };

    const acceptParticipants = getAppointmentsResult.data[0].accept_user.map((user: any) => ({
      userId: user.id,
      username: user.username,
      sex: user.sex,
      birthdate: user.birthdate,
      description: user.description,
      image: user.image,
      email: "",
      isAdmin: false,
      isVerified: user.is_verified,
    }));

    console.log(acceptParticipants);
    const pendingParticipants = getAppointmentsResult.data[0].pending_user.map((user: any) => ({
      userId: user.id,
      username: user.username,
      sex: user.sex,
      birthdate: user.birthdate,
      description: user.description,
      image: user.image,
      email: "",
      isAdmin: false,
      isVerified: user.is_verified,
    }));

    const rejectParticipants = getAppointmentsResult.data[0].reject_user.map((user: any) => ({
      userId: user.id,
      username: user.username,
      sex: user.sex,
      birthdate: user.birthdate,
      description: user.description,
      image: user.image,
      email: "",
      isAdmin: false,
      isVerified: user.is_verified,
    }));

    return {
      detailHeader,
      ownerId: getAppointmentsResult.data[0].owner_id,
      images: getAppointmentsResult.data[0].images,
      participantAmount: getAppointmentsResult.data[0].participant_number,
      pendingParticipants: pendingParticipants,
      acceptParticipants: acceptParticipants,
      rejectParticipants: rejectParticipants,
    };
  }

  async EndAppointment(appointmentId: number): Promise<void> {
    const endAppointmentResult = await this.supabaseClient.rpc("end_appointment", {
      end_id: appointmentId,
    });
    if (endAppointmentResult.error) {
      console.log(endAppointmentResult.error);
      throw new Error("Something went wrong!!");
    }
  }

  async GetAppointmentsToRate(userId: string): Promise<Appointment[]> {
    const getAppointmentsResult = await this.supabaseClient.rpc("get_appointment_to_rate", {
      id: userId,
    });

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
      startDateTime: dayjs(appointment.start_time).format("DD/MM/YYYY hh:mm A"),
      endDateTime: dayjs(appointment.end_time).format("DD/MM/YYYY hh:mm A"),
      participantAmount: appointment.participant_number,
    }));
  }
}
