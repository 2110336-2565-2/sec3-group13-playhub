import { useContext, useEffect, useState } from "react";
import Navbar from "@/components/public/Navbar";
import { Typography, Box, IconButton, Stack, Card, FormHelperText, Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AppointmentDetail } from "@/types/Appointment";
import { Service } from "@/services";
import { useRouter } from "next/router";
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
import Participant from "@/components/post/Participant";
import { COLOR_CODE } from "enum/COLOR";
import CommonButton from "@/components/public/CommonButton";

const HostAppointmentStyle = {
  TextField: {
    width: "28vw",
    minWidth: "400px",
  },
  Card: {
    width: "30vw",
    minWidth: "450px",
    paddingTop: "2vh",
  },
};

export default function Home() {
  const service = new Service();
  const router = useRouter();
  const userStatus = useContext(userContext);
  const [appointment, setAppointment] = useState<AppointmentDetail | null>();
  const [isParticipant, setIsParticipant] = useState<boolean | null>(null);

  const appointmentId = parseInt(router.query.appointment_id as string);
  useEffect(() => {
    service.appointment
      .GetAppointmentByAppointmentId(appointmentId)
      .then((appointment) => {
        setAppointment(appointment);
        setIsParticipant(appointment.ownerId !== userStatus.user?.userId);
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  }, [appointmentId, userStatus.user]);

  function compareDate(): boolean {
    if (appointment) {
      const date: string = appointment.detailHeader.endDateTime.split(" ")[0];
      const time: string = appointment.detailHeader.endDateTime.split(" ")[1];
      const am_pm: string = appointment.detailHeader.endDateTime.split(" ")[2];

      const endDate: Date = new Date(
        Number(date.split("/")[2]),
        Number(date.split("/")[1]) - 1,
        Number(date.split("/")[0]),
        Number(time.split(":")[0]) + Number(am_pm === "PM" ? 12 : 0),
        Number(time.split(":")[1])
      );

      return endDate >= new Date();
    }
    return false;
  }

  function backToMyAppointments(): void {
    router.push(PAGE_PATHS.MY_APPOINTMENTS);
    return;
  }

  function handleEndAppointment(): void {
    service.appointment
      .EndAppointment(appointmentId)
      .then(() => {
        router.push(PAGE_PATHS.MY_APPOINTMENTS);
        return;
      })
      .catch((err) => {
        console.log(err);
        return;
      });
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

      <Stack spacing={4} sx={{ marginTop: "70px", marginBottom: "2vh" }} alignItems="center">
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
                  handleValueChange={() => {}}
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
                  onChange={() => {}}
                  isErr={false}
                  errMsg=""
                  disabled={true}
                />
              </Box>

              {/* Date & Time */}
              <Box sx={HostAppointmentStyle.TextField}>
                <DisplayDateTime
                  header="Date & Time"
                  value={`${appointment.detailHeader.startDateTime} - ${appointment.detailHeader.endDateTime}`}
                />
              </Box>

              {/* Tags */}
              <Box sx={HostAppointmentStyle.TextField}>
                <Tags
                  header="Tag"
                  value={appointment.detailHeader.tags.map((t, index): Tag => {
                    return { name: t, id: index };
                  })}
                  handleValueChange={() => {}}
                  menuValue={[]}
                  isErr={false}
                  errMsg=""
                  disabled={true}
                />
                <FormHelperText>{"\u00A0"}</FormHelperText>
              </Box>

              {/* Description */}
              <Box sx={HostAppointmentStyle.TextField}>
                <DescriptionTextField
                  name="description"
                  header="Description"
                  placeholder="Enter Description Here"
                  value={appointment.detailHeader.description}
                  handleValueChange={() => {}}
                  isErr={false}
                  errMsg=""
                  height={8}
                  disabled={true}
                />
              </Box>

              {/* Image list */}
              {appointment.images.length !== 0 && (
                <Box sx={HostAppointmentStyle.TextField}>
                  <DisplayImages header="Image" images={appointment.images} />
                </Box>
              )}
            </Stack>
          </Card>
          <Card sx={HostAppointmentStyle.Card}>
            <Stack spacing={3} alignItems="center" justifyContent="center">
              {/* Number of participants */}
              <Box sx={HostAppointmentStyle.TextField}>
                <Typography variant="h3">{`Number of Participant : ${appointment.acceptParticipants.length}`}</Typography>
              </Box>

              {/* Pending Participant List */}
              <Stack
                spacing={0.5}
                alignItems="start"
                justifyContent="center"
                sx={HostAppointmentStyle.TextField}
              >
                <Typography variant="h2">Pending Participant List :</Typography>
                <Box display="flex">
                  {appointment.pendingParticipants.length == 0 && (
                    <Typography variant="body1" color="error">
                      No one is pended in this activity yet.
                    </Typography>
                  )}
                </Box>
                <Grid container spacing={1} style={{ marginLeft: -5 }}>
                  {appointment.pendingParticipants.map((participant, index) => (
                    <Grid item key={index}>
                      <Participant participant={participant} color={COLOR_CODE.PRIMARY} />
                    </Grid>
                  ))}
                </Grid>
              </Stack>

              {/* Accept Participant List */}
              <Stack
                spacing={0.5}
                alignItems="start"
                justifyContent="center"
                sx={HostAppointmentStyle.TextField}
              >
                <Typography variant="h2">Accept Participant List :</Typography>
                <Box display="flex">
                  {appointment.acceptParticipants.length == 0 && (
                    <Typography variant="body1" color="error">
                      No one is accepted in this activity yet.
                    </Typography>
                  )}
                </Box>
                <Grid container spacing={1} style={{ marginLeft: -5 }}>
                  {appointment.acceptParticipants.map((participant, index) => (
                    <Grid item key={index}>
                      <Participant participant={participant} color={COLOR_CODE.ACCEPT} />
                    </Grid>
                  ))}
                </Grid>
              </Stack>

              {/* Reject Participant List */}
              <Stack
                spacing={0.5}
                alignItems="start"
                justifyContent="center"
                sx={HostAppointmentStyle.TextField}
              >
                <Typography variant="h2">Reject Participant List :</Typography>
                <Box display="flex">
                  {appointment.rejectParticipants.length == 0 && (
                    <Typography variant="body1" color="error">
                      No one is rejected in this activity yet.
                    </Typography>
                  )}
                </Box>
                <Grid container spacing={1} style={{ marginLeft: -5 }}>
                  {appointment.rejectParticipants.map((participant, index) => (
                    <Grid item key={index}>
                      <Participant participant={participant} color={COLOR_CODE.ERROR} />
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </Stack>
          </Card>
        </Stack>
        <CommonButton label="End" onClick={handleEndAppointment} disabled={compareDate()} />
        {compareDate() && (
          <Typography variant="body2" color="error" style={{ marginTop: "1vh" }}>
            *Can’t enter this button before end date time
          </Typography>
        )}
      </Stack>
    </>
  );
}
