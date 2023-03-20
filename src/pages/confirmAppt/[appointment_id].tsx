import React, { useContext, useEffect, useState } from "react";
import Navbar from "@/components/public/Navbar";
import { Typography, Box, Link, Button, Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AppointmentParticipantCard from "@/components/appointment/AppointmentParticipantCard";
import { AppointmentDetail } from "@/types/Appointment";
import {
  AcceptAppointment,
  GetAppointmentsByAppointmentId,
  RejectAppointment,
} from "@/services/Appointments";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import Loading from "@/components/public/Loading";
import ConfirmApptDialog from "@/components/appointment/ConfirmApptDialog";
import { PagePaths } from "enum/PAGES";
import { userContext } from "supabase/user_context";

export default function Home() {
  const router = useRouter();
  const userStatus = useContext(userContext);
  const supabaseClient = useSupabaseClient<Database>();
  const [appointment, setAppointment] = useState<AppointmentDetail | null>();
  const [isParticipant, setIsParticipant] = useState<boolean | null>(null);

  const appointmentId = parseInt(router.query.appointment_id as string);
  useEffect(() => {
    GetAppointmentsByAppointmentId(appointmentId, supabaseClient)
      .then((appointment) => {
        setAppointment(appointment);
        setIsParticipant(
          appointment.pendingParticipants.includes(userStatus.user?.username as string)
        );
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  }, [supabaseClient, appointmentId, userStatus.user]);

  const [choice, setChoice] = useState<"accept" | "reject" | null>(null);

  if (!appointment || userStatus.isLoading) return <Loading />;
  if (!isParticipant) {
    router.push(PagePaths.selectApptToConfirm);
    return;
  }
  if (!userStatus.user) {
    router.push(PagePaths.login);
    return;
  }
  return (
    <>
      <Navbar />
      <Box display="flex" paddingBottom="40px">
        <Link href={PagePaths.selectApptToConfirm}>
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
      <Box display="flex" justifyContent="center" padding="40px" gap={5}>
        <Grid item xs={6}>
          <Button
            variant="contained"
            onClick={() => {
              setChoice("accept");
            }}
          >
            ACCEPT
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setChoice("reject");
            }}
          >
            REJECT
          </Button>
        </Grid>
      </Box>
      {choice && (
        <ConfirmApptDialog
          openModal={true}
          handleCloseModal={() => {
            setChoice(null);
          }}
          choice={choice}
          onConfirm={() => {
            if (choice === "accept" && userStatus.user) {
              AcceptAppointment(appointmentId, userStatus.user.userId, supabaseClient).catch(
                (err) => {
                  console.log(err);
                  return;
                }
              );
              router.push(PagePaths.selectApptToConfirm);
            }
            if (choice === "reject" && userStatus.user) {
              RejectAppointment(appointmentId, userStatus.user.userId, supabaseClient).catch(
                (err) => {
                  console.log(err);
                  return;
                }
              );
              router.push(PagePaths.selectApptToConfirm);
            }
          }}
        />
      )}
    </>
  );
}
