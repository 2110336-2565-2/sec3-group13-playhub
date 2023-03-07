import AppointmentCard from "@/components/appointment/AppointmentCard";
import Navbar from "@/components/public/Navbar";
import { GetAppointmentsByUserId } from "@/services/Appointments";
import { Appointment } from "@/types/Appointment";
import { Typography, Grid, Box } from "@mui/material";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useContext, useEffect, useState } from "react";
import { Database } from "supabase/db_types";
import { userContext } from "supabase/user_context";
import { NextRouter, useRouter } from "next/router";
import { PagePaths } from "enum/pages";

export default function Home() {
  const router: NextRouter = useRouter();

  const supabaseClient = useSupabaseClient<Database>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const userStatus = useContext(userContext);

  function handleCardClick(appointmentId: string): void {
    router.push(PagePaths.confirmAppt + appointmentId);
  }

  useEffect(() => {
    if (!userStatus.user) return;

    GetAppointmentsByUserId(userStatus.user.userId, supabaseClient)
      .then((appointment) => {
        console.log(appointment);
        setAppointments(appointment);
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  }, [supabaseClient, userStatus.user]);

  return (
    <>
      <Navbar />
      <Typography paddingTop="40px" variant="h4" align="center">
        Select Appointment To Confirm
      </Typography>
      <Box display="flex" justifyContent="center" padding="40px">
        <Grid container spacing="40px" width="80vw">
          {appointments.map((item, index) => (
            <Grid item xs={12} md={6} key={index}>
              <div onClick={() => handleCardClick(item.appointmentId)}>
                <AppointmentCard appointment={item} />
              </div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
