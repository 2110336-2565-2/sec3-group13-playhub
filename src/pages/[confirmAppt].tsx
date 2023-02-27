import React, { useEffect, useState } from "react";
import Navbar from "@/components/public/Navbar";
import { Typography, Box, Link, Button, Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AppointmentParticipantCard from "@/components/appointment/AppointmentParticipantCard";
import { AppointmentDetail } from "@/types/Appointment";
import { GetAppointmentsByAppointmentId } from "@/services/Appointments";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import Loading from "@/components/public/Loading";

export default function Home() {
  const router = useRouter();
  const supabaseClient = useSupabaseClient<Database>();
  const [appointment, setAppointment] = useState<AppointmentDetail | null>(null);

  const appointmentId = parseInt(router.query.appointment_id as string);
  useEffect(() => {
    console.log(appointmentId);
    GetAppointmentsByAppointmentId(appointmentId, supabaseClient)
      .then((appointment) => {
        console.log(appointment);
        setAppointment(appointment);
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  }, [supabaseClient, appointmentId]);

  if (!appointment) return <Loading />;
  return (
    <>
      <Navbar />
      <Box display="flex" paddingBottom="40px">
        <Link>
          <ArrowBackIcon
            fontSize="large"
            sx={{ position: "absolute", margin: "3vh 0 0 3vh", color: "black" }}
          />
        </Link>
      </Box>
      <Typography paddingTop="40px" variant="h4" align="center">
        Confirm Appointment
      </Typography>
      <Box display="flex" justifyContent="center" padding="40px">
        <AppointmentParticipantCard appointmentDetail={appointment} />
      </Box>
      <Box display="flex" justifyContent="center" padding="40px">
        <Grid item xs={6}>
          <Button variant="contained">ACCEPT</Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" color="secondary">
            REJECT
          </Button>
        </Grid>
      </Box>
    </>
  );
}
