import React, { useEffect, useState } from "react";
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
import Loading from "@/components/public/Loading";

const isHost = true;
export default function Home() {
  const router = useRouter();
  const supabaseClient = useSupabaseClient<Database>();
  const [appointment, setAppointment] = useState<AppointmentDetail | null>(null);

  const appointmentId = parseInt(router.query.appointment_id as string);
  useEffect(() => {
    console.log(appointmentId);
    GetAppointmentsByAppointmentId(appointmentId, supabaseClient).then((appointment) => {
      console.log(appointment);
      setAppointment(appointment);
    }).catch((err) => {
      console.log(err)
      return;
    })

  }, [supabaseClient, appointmentId]);


  if (!appointment) return <Loading />
  return <>
    <Navbar />
    <Box
      display="flex"
      paddingBottom="40px"
    >
      <Link>
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