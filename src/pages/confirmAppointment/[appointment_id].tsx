import React, { useContext, useEffect, useState } from "react";
import Navbar from "@/components/public/Navbar";
import { Typography, Box, Link, Button, Grid, IconButton, Stack, Card, FormHelperText } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AppointmentParticipantCard from "@/components/appointment/AppointmentParticipantCard";
import { AppointmentDetail } from "@/types/Appointment";
import {
  AcceptAppointment,
  GetAppointmentByAppointmentId,
  RejectAppointment,
} from "@/services/Appointments";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import Loading from "@/components/public/Loading";
import ConfirmApptDialog from "@/components/appointment/ConfirmApptDialog";
import { PAGE_PATHS } from "enum/PAGES";
import { userContext } from "supabase/user_context";
import TitleTextField from "@/components/post/TitleTextField";
import LocationTextField from "@/components/post/LocationTextField";
import DisplayDateTime from "@/components/appointment/DisplayDateTime";
import Tags from "@/components/post/SelectTags";
import { Tag } from "@/types/Tag";
import DescriptionTextField from "@/components/public/DescriptionTextField";
import DisplayImages from "@/components/post/DisplayImages";
import Participant from "@/components/post/Participant";
import { User } from "@/types/User";

const ConfirmAppointmentStyle = {
  TextField: {
    width: "28vw",
    minWidth: "250px",
  },
  Card: {
    width: "30vw",
    minWidth: "300px",
    height: "75vh",
    minHeight: "785px",
    paddingTop: "2vh",
  },
};

export default function Home() {
  const router = useRouter();
  const userStatus = useContext(userContext);
  const supabaseClient = useSupabaseClient<Database>();
  const [appointment, setAppointment] = useState<AppointmentDetail | null>();
  const [isParticipant, setIsParticipant] = useState<boolean | null>(null);
  const [participant, setParticipants] = useState<User[] | null>(null);

  const appointmentId = parseInt(router.query.appointment_id as string);
  useEffect(() => {
    GetAppointmentByAppointmentId(appointmentId, supabaseClient)
      .then((appointment) => {
        setAppointment(appointment);
        setIsParticipant(appointment.ownerId !== userStatus.user?.userId);
      })
      .catch((err) => {
        console.log(err);
        return;
      });

    if (appointment) {
      // setParticipants(appointment.acceptParticipants.map((participant, index) => (
      //   GetUserByUserId(participant, )
      // )))
      console.log(appointment.acceptParticipants)
    }

  }, [supabaseClient, appointmentId, userStatus.user]);

  const [choice, setChoice] = useState<"accept" | "reject" | null>(null);

  function backToSelectAppointment(): void {
    router.push(PAGE_PATHS.SELECT_APPOINTMENT);
    return;
  }

  if (!appointment || userStatus.isLoading) return <Loading />;
  if (!isParticipant) {
    router.push(PAGE_PATHS.SELECT_APPOINTMENT);
    return;
  }
  if (!userStatus.user) {
    router.push(PAGE_PATHS.LOGIN);
    return;
  }
  return (
    <>
      <Navbar />

      <IconButton
        onClick={backToSelectAppointment}
        style={{ position: "absolute", top: 86, left: 20, zIndex: "1" }}
      >
        <ArrowBackIcon fontSize="large" color="secondary" />
      </IconButton>

      <Stack spacing={4} sx={{ marginBottom: "2vh", }} alignItems="center">
        {/* Page header */}
        <Box sx={{ marginTop: "3vh" }}>
          <Typography variant="h1">Confirm Appointment</Typography>
        </Box>


        <Stack spacing={5} direction="row">
          <Card sx={ConfirmAppointmentStyle.Card}>
            <Stack spacing={0} alignItems="center" justifyContent="center">
              {/* Post title */}
              <Box style={ConfirmAppointmentStyle.TextField}>
                <TitleTextField
                  name="title"
                  header="Title"
                  placeholder="This is Post Title"
                  value={appointment.detailHeader.title}
                  handleValueChange={() => { }}
                  isErr={false}
                  errMsg=""
                  readOnly={true}
                />
              </Box>

              {/* Location */}
              <Box sx={ConfirmAppointmentStyle.TextField}>
                <LocationTextField
                  header="Location"
                  placeholder="Enter Location"
                  initialValue={appointment.detailHeader.location}
                  onChange={() => { }}
                  isErr={false}
                  errMsg=""
                  readOnly={true}
                />
              </Box>

              {/* Date & Time */}
              <Box sx={ConfirmAppointmentStyle.TextField}>
                <DisplayDateTime
                  header="Date & Time"
                  value={`${appointment.detailHeader.startDateTime.format("DD/MM/YYYY h:mm A")} - ${appointment.detailHeader.endDateTime.format("DD/MM/YYYY h:mm A")}`}
                  readOnly={true}
                />
              </Box>

              {/* Tags */}
              <Box sx={ConfirmAppointmentStyle.TextField}>
                <Tags
                  header="Tag"
                  value={appointment.detailHeader.tags.map((t, index): Tag => { return { name: t, id: index } })}
                  handleValueChange={() => { }}
                  menuValue={[]}
                  isErr={false}
                  errMsg=""
                  readOnly={true}
                />
                <FormHelperText>
                  {"\u00A0"}
                </FormHelperText>
              </Box>

              {/* Description */}
              <Box sx={ConfirmAppointmentStyle.TextField}>
                <DescriptionTextField
                  name="description"
                  header="Description"
                  placeholder="Enter Description Here"
                  value={appointment.detailHeader.description}
                  handleValueChange={() => { }}
                  isErr={false}
                  errMsg=""
                  height={8}
                  readOnly={true}
                />
              </Box>
            </Stack>
          </Card>
          <Card sx={ConfirmAppointmentStyle.Card}>
            <Stack spacing={3} alignItems="center" justifyContent="center">
              {/* Image list */}
              <Box sx={ConfirmAppointmentStyle.TextField}>
                <DisplayImages
                  header="Image"
                  images={appointment.images}
                />
              </Box>

              {/* Number of participants */}
              <Box sx={ConfirmAppointmentStyle.TextField}>
                <Typography variant="h3">{`Number of Participant : ${appointment.acceptParticipants.length}`}</Typography>
              </Box>

              {/* Participant List */}
              <Stack spacing={1} alignItems="start" justifyContent="center">
                <Typography variant="h2">Join with</Typography>
                <Box display="flex">
                  {appointment.acceptParticipants.length == 0 && (
                    <Typography variant="body1" color="error">
                      No one is interested in this activity yet.
                    </Typography>
                  )}
                </Box>
                <Grid container spacing={1} style={{ marginLeft: -5 }}>
                  {appointment.acceptParticipants.map((participant, index) => (
                    <Grid item key={index}>
                      <Participant participant={participant} />
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </Stack>
      {/* <Navbar />
      <Box display="flex" paddingBottom="40px">
        <Link href={PAGE_PATHS.SELECT_APPOINTMENT}>
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
              router.push(PAGE_PATHS.SELECT_APPOINTMENT);
              return;
            }
            if (choice === "reject" && userStatus.user) {
              RejectAppointment(appointmentId, userStatus.user.userId, supabaseClient).catch(
                (err) => {
                  console.log(err);
                  return;
                }
              );
              router.push(PAGE_PATHS.SELECT_APPOINTMENT);
              return;
            }
          }}
        />
      )} */}
    </>
  );
}
