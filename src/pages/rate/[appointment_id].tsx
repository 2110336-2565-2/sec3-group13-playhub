import { useContext, useEffect, useState } from "react";
import Navbar from "@/components/public/Navbar";
import { Typography, Box, IconButton, Stack, Card, FormHelperText, Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AppointmentDetail } from "@/types/Appointment";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { Service } from "@/services";
import { useRouter } from "next/router";
import Loading from "@/components/public/Loading";
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
import { COLOR_CODE } from "enum/COLOR";
import CommonButton from "@/components/public/CommonButton";
import RateDialog from "@/components/rate/RateDialog";

const ParticipantAppointmentStyle = {
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
  const supabaseClient = useSupabaseClient<Database>();
  const service = new Service(supabaseClient);
  const router = useRouter();
  const userStatus = useContext(userContext);
  const [appointment, setAppointment] = useState<AppointmentDetail | null>();
  const [isParticipant, setIsParticipant] = useState<boolean | null>(null);

  const [isReviewed, setIsReviewed] = useState<boolean | null>(null);
  const [openRateModal, setOpenRateModal] = useState<boolean>(false);

  const handleOpenRateModal = (): void => setOpenRateModal(true);
  const handleCloseRateModal = (): void => setOpenRateModal(false);

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

    if (userStatus.user) {
      service.review
        .GetIsUserReviewedAppointment(userStatus.user.userId, appointmentId)
        .then((value) => setIsReviewed(value));
    }
  }, [appointmentId, userStatus.user]);

  function backToMyAppointments(): void {
    router.push(PAGE_PATHS.SELECT_RATE);
    return;
  }

  if (!appointment || userStatus.isLoading) return <Loading />;
  if (!isParticipant) {
    router.push(PAGE_PATHS.SELECT_RATE);
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

      <Stack spacing={4} sx={{ marginBottom: "2vh" }} alignItems="center">
        {/* Page header */}
        <Box sx={{ marginTop: "3vh" }}>
          <Typography variant="h1">Rate Appointment</Typography>
        </Box>

        <Stack spacing={5} direction="row">
          <Card sx={ParticipantAppointmentStyle.Card}>
            <Stack spacing={0} alignItems="center" justifyContent="center">
              {/* Post title */}
              <Box style={ParticipantAppointmentStyle.TextField}>
                <TitleTextField
                  name="title"
                  header="Title"
                  placeholder="This is Post Title"
                  value={appointment.detailHeader.title}
                  handleValueChange={() => {}}
                  isErr={false}
                  errMsg=""
                  readOnly={true}
                />
              </Box>

              {/* Location */}
              <Box sx={ParticipantAppointmentStyle.TextField}>
                <LocationTextField
                  header="Location"
                  placeholder="Enter Location"
                  initialValue={appointment.detailHeader.location}
                  onChange={() => {}}
                  isErr={false}
                  errMsg=""
                  readOnly={true}
                />
              </Box>

              {/* Date & Time */}
              <Box sx={ParticipantAppointmentStyle.TextField}>
                <DisplayDateTime
                  header="Date & Time"
                  value={`${appointment.detailHeader.startDateTime} - ${appointment.detailHeader.endDateTime}`}
                  readOnly={true}
                />
              </Box>

              {/* Tags */}
              <Box sx={ParticipantAppointmentStyle.TextField}>
                <Tags
                  header="Tag"
                  value={appointment.detailHeader.tags.map((t, index): Tag => {
                    return { name: t, id: index };
                  })}
                  handleValueChange={() => {}}
                  menuValue={[]}
                  isErr={false}
                  errMsg=""
                  readOnly={true}
                />
                <FormHelperText>{"\u00A0"}</FormHelperText>
              </Box>

              {/* Description */}
              <Box sx={ParticipantAppointmentStyle.TextField}>
                <DescriptionTextField
                  name="description"
                  header="Description"
                  placeholder="Enter Description Here"
                  value={appointment.detailHeader.description}
                  handleValueChange={() => {}}
                  isErr={false}
                  errMsg=""
                  height={8}
                  readOnly={true}
                />
              </Box>
            </Stack>
          </Card>
          <Card sx={ParticipantAppointmentStyle.Card}>
            <Stack spacing={3} alignItems="center" justifyContent="center">
              {/* Image list */}
              {appointment.images.length !== 0 && (
                <Box sx={ParticipantAppointmentStyle.TextField}>
                  <DisplayImages header="Image" images={appointment.images} />
                </Box>
              )}

              {/* Number of participants */}
              <Box sx={ParticipantAppointmentStyle.TextField}>
                <Typography variant="h3">{`Number of Participant : ${appointment.acceptParticipants.length}`}</Typography>
              </Box>

              {/* Participant List */}
              <Stack
                spacing={0.5}
                alignItems="start"
                justifyContent="center"
                sx={ParticipantAppointmentStyle.TextField}
              >
                <Typography variant="h2">Join with</Typography>
                <Box display="flex">
                  {appointment.acceptParticipants.length == 0 && (
                    <Typography variant="body1" color="error">
                      No one is interested in this activity yet.
                    </Typography>
                  )}
                </Box>
                <Grid container spacing={1} style={{ marginLeft: -5 }}>
                  <Grid item key={-1}>
                    <Participant
                      participant={
                        appointment.acceptParticipants.filter(
                          (p) => p.userId === appointment.ownerId
                        )[0]
                      }
                      color={COLOR_CODE.PRIMARY}
                    />
                  </Grid>
                  {appointment.acceptParticipants
                    .filter((p) => p.userId !== appointment.ownerId)
                    .map((participant, index) => (
                      <Grid item key={index}>
                        <Participant participant={participant} />
                      </Grid>
                    ))}
                </Grid>
              </Stack>
            </Stack>
          </Card>
        </Stack>

        <CommonButton label={isReviewed ? "Edit Rate" : "Rate"} onClick={handleOpenRateModal} />
      </Stack>

      <RateDialog
        openModal={openRateModal}
        handleCloseModal={handleCloseRateModal}
        appointmentId={appointmentId}
        isEditing={isReviewed!}
      />
    </>
  );
}
