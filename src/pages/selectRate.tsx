import AppointmentCard from "@/components/appointment/AppointmentCard";
import Navbar from "@/components/public/Navbar";
import { Service } from "@/services";
import { Appointment } from "@/types/Appointment";
import { Typography, Grid, Box, Stack } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { userContext } from "supabase/user_context";
import { NextRouter, useRouter } from "next/router";
import { PAGE_PATHS } from "enum/PAGES";
import Loading from "@/components/public/Loading";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";

export default function Home() {
  const supabaseClient = useSupabaseClient<Database>();
  const service = new Service(supabaseClient);
  const router: NextRouter = useRouter();
  const userStatus = useContext(userContext);

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (!userStatus.user) return;

    service.appointment
      .GetAppointmentsToRate(userStatus.user.userId)
      .then((appointment) => {
        setAppointments(appointment);
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  }, [userStatus.user]);

  if (userStatus.isLoading) return <Loading />;
  if (!userStatus.user) {
    router.push(PAGE_PATHS.LOGIN);
    return;
  }
  if (appointments == null) return <Loading />;
  return (
    <>
      <Navbar />

      <Stack spacing={4} alignItems="center" style={{ marginBottom: "4vh" }}>
        {/* Page header */}
        <Box sx={{ marginTop: "3vh" }}>
          <Typography variant="h1">Select Appointment To Rate</Typography>
        </Box>
        {appointments.length === 0 ? (
          <Stack alignItems="center" justifyContent="center" style={{ height: "70vh" }}>
            <Typography variant="h2">No Appointment to Rate Yet.</Typography>
          </Stack>
        ) : (
          <Grid
            container
            justifyContent="space-between"
            rowSpacing={6}
            style={{ width: "80vw", marginTop: -6 }}
          >
            {appointments.map((appointment, index) => (
              <Grid item key={index} xs={5.75}>
                <AppointmentCard appointment={appointment} prefix={PAGE_PATHS.RATE} />
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>
    </>
  );
}
