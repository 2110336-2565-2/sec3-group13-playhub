import React, { useContext, useEffect, useState } from "react";
import Navbar from "@/components/public/Navbar";
import { Box, Link } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AppointmentParticipantCard from "@/components/appointment/AppointmentParticipantCard";
import AppointmentHostCard from "@/components/appointment/AppointmentHostCard";
import { AppointmentDetail } from "@/types/Appointment";
import { GetAppointmentsByAppointmentId } from "@/services/Appointment";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { PAGE_PATHS } from "enum/PAGES";
import Loading from "@/components/public/Loading";
import { userContext } from "supabase/user_context";

export default function Home() {
  const router = useRouter();
  const userStatus = useContext(userContext);
  const supabaseClient = useSupabaseClient<Database>();
  const [appointment, setAppointment] = useState<AppointmentDetail | null>(null);
  const [isHost, setIsHost] = useState<boolean | null>(null);
  const [isParticipant, setIsParticipant] = useState<boolean | null>(null);

  const appointmentId = parseInt(router.query.appointment_id as string);
  useEffect(() => {
    if (!appointmentId || !userStatus.user) return;
    GetAppointmentsByAppointmentId(appointmentId, supabaseClient).then((appointment) => {
      setIsHost(userStatus.user?.userId == appointment?.ownerId);
      setIsParticipant(appointment?.acceptParticipants.includes(userStatus.user?.username as string))
      setAppointment(appointment);
    }).catch((err) => {
      console.log(err)
      return;
    })

  }, [supabaseClient, appointmentId, userStatus.user?.userId]);

  function handleGoBack(): void {
    router.push(PAGE_PATHS.MY_APPOINTMENTS);
    return;
  }

  if (!appointment || userStatus.isLoading) return <Loading />
  if (!userStatus.user) router.push(PAGE_PATHS.LOGIN)
  if (!isParticipant) return handleGoBack()
  return <>
    <Navbar />
    <Box
      display="flex"
      paddingBottom="40px"
    >
      <Link onClick={handleGoBack}>
        <ArrowBackIcon
          fontSize="large"
          sx={{ position: "absolute", margin: "3vh 0 0 3vh", color: "black" }}
        />
      </Link>
    </Box>
    <Box
      display="flex"
      justifyContent="center"
      padding="40px"
    >
      {isHost ? <AppointmentHostCard appointmentDetail={appointment} />
        : <AppointmentParticipantCard appointmentDetail={appointment} />}
    </Box>
  </>;
}