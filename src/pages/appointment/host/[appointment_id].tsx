import React, { useContext, useEffect, useState } from "react";
import Navbar from "@/components/public/Navbar";
import { Typography, Box, IconButton, Stack, Card, FormHelperText } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AppointmentDetail } from "@/types/Appointment";
import { GetAppointmentByAppointmentId } from "@/services/Appointment";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import Loading from "@/components/public/Loading";
import { PAGE_PATHS, ROLE } from "enum/PAGES";
import { userContext } from "supabase/user_context";
import TitleTextField from "@/components/post/TitleTextField";
import LocationTextField from "@/components/post/LocationTextField";
import DisplayDateTime from "@/components/appointment/DisplayDateTime";
import Tags from "@/components/post/SelectTags";
import { Tag } from "@/types/Tag";
import DescriptionTextField from "@/components/public/DescriptionTextField";
import DisplayImages from "@/components/post/DisplayImages";
import { User } from "@/types/User";

const HostAppointmentStyle = {
  TextField: {
    width: "28vw",
    minWidth: "250px",
  },
  Card: {
    width: "30vw",
    minWidth: "300px",
    height: "75vh",
    minHeight: "1200px",
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

  function backToMyAppointments(): void {
    router.push(PAGE_PATHS.MY_APPOINTMENTS);
    return;
  }

  if (!appointment || userStatus.isLoading) return <Loading />;
  if (isParticipant) {
    router.push(PAGE_PATHS.APPOINTMENT + ROLE.PARTICIPANT + appointmentId);
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
        onClick={backToMyAppointments}
        style={{ position: "absolute", top: 86, left: 20, zIndex: "1" }}
      >
        <ArrowBackIcon fontSize="large" color="secondary" />
      </IconButton>

      <Stack spacing={4} sx={{ marginTop: "5vh", marginBottom: "2vh", }} alignItems="center">
        <Stack spacing={5} direction="row">
          <Card sx={HostAppointmentStyle.Card}>
            <Stack spacing={0} alignItems="center" justifyContent="center">
              {/* Post title */}
              <Box style={HostAppointmentStyle.TextField}>
                <TitleTextField
                  name="title"
                  header="Title"
                  placeholder="This is Post Title"
                  value={appointment.detailHeader.title}
                  handleValueChange={() => { }}
                  isErr={false}
                  errMsg=""
                  disabled={true}
                />
              </Box>

              {/* Location */}
              <Box sx={HostAppointmentStyle.TextField}>
                <LocationTextField
                  header="Location"
                  placeholder="Enter Location"
                  initialValue={appointment.detailHeader.location}
                  onChange={() => { }}
                  isErr={false}
                  errMsg=""
                  disabled={true}
                />
              </Box>

              {/* Date & Time */}
              <Box sx={HostAppointmentStyle.TextField}>
                <DisplayDateTime
                  header="Date & Time"
                  value={`${appointment.detailHeader.startDateTime.format("DD/MM/YYYY h:mm A")} - ${appointment.detailHeader.endDateTime.format("DD/MM/YYYY h:mm A")}`}
                />
              </Box>

              {/* Tags */}
              <Box sx={HostAppointmentStyle.TextField}>
                <Tags
                  header="Tag"
                  value={appointment.detailHeader.tags.map((t, index): Tag => { return { name: t, id: index } })}
                  handleValueChange={() => { }}
                  menuValue={[]}
                  isErr={false}
                  errMsg=""
                  disabled={true}
                />
                <FormHelperText>
                  {"\u00A0"}
                </FormHelperText>
              </Box>

              {/* Description */}
              <Box sx={HostAppointmentStyle.TextField}>
                <DescriptionTextField
                  name="description"
                  header="Description"
                  placeholder="Enter Description Here"
                  value={appointment.detailHeader.description}
                  handleValueChange={() => { }}
                  isErr={false}
                  errMsg=""
                  height={8}
                  disabled={true}
                />
              </Box>

              {/* Image list */}
              <Box sx={HostAppointmentStyle.TextField}>
                <DisplayImages
                  header="Image"
                  images={appointment.images}
                />
              </Box>
            </Stack>
          </Card>
          <Card sx={HostAppointmentStyle.Card}>
            <Stack spacing={3} alignItems="center" justifyContent="center">


              {/* Number of participants */}
              <Box sx={HostAppointmentStyle.TextField}>
                <Typography variant="h3">{`Number of Participant : ${appointment.acceptParticipants.length}`}</Typography>
              </Box>

              {/* Participant List */}
              {/* <Stack spacing={1} alignItems="start" justifyContent="center">
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
              </Stack> */}
            </Stack>
          </Card>
        </Stack>
      </Stack>
    </>
  );
}
