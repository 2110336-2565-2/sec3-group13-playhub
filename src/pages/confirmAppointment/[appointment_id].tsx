import React, { useContext, useEffect, useState } from "react";
import Navbar from "@/components/public/Navbar";
import { Typography, Box, Grid, IconButton, Stack, Card, FormHelperText } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AppointmentDetail } from "@/types/Appointment";
import {
  AcceptAppointment,
  GetAppointmentByAppointmentId,
  RejectAppointment,
} from "@/services/Appointment";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
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
import { User } from "@/types/User";
import CommonButton from "@/components/public/CommonButton";
import { COLOR, COLOR_CODE } from "enum/COLOR";
import CommonDialog from "@/components/public/CommonDialog";

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

  const appointmentId = parseInt(router.query.appointment_id as string);

  const [openAcceptAppointmentModal, setOpenAcceptAppointmentModal] = useState<boolean>(false);
  const [openRejectAppointmentModal, setOpenRejectAppointmentModal] = useState<boolean>(false);

  const handleOpenAcceptAppointmentModal = (): void => setOpenAcceptAppointmentModal(true);
  const handleCloseAcceptAppointmentModal = (): void => setOpenAcceptAppointmentModal(false);
  const handleOpenRejectAppointmentModal = (): void => setOpenRejectAppointmentModal(true);
  const handleCloseRejectAppointmentModal = (): void => setOpenRejectAppointmentModal(false);

  function handleAcceptAppointment(): void {
    if (userStatus.user) {
      AcceptAppointment(appointmentId, userStatus.user.userId, supabaseClient).catch((err) => {
        console.log(err);
        return;
      });
      router.push(PAGE_PATHS.SELECT_APPOINTMENT);
    }
    return;
  }

  function handleRejectAppointment(): void {
    if (userStatus.user) {
      RejectAppointment(appointmentId, userStatus.user.userId, supabaseClient).catch((err) => {
        console.log(err);
        return;
      });
      router.push(PAGE_PATHS.SELECT_APPOINTMENT);
    }
    return;
  }

  useEffect(() => {
    if (!appointmentId) return;
    GetAppointmentByAppointmentId(appointmentId, supabaseClient)
      .then((appointment) => {
        setAppointment(appointment);
        setIsParticipant(appointment.ownerId !== userStatus.user?.userId);
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  }, [supabaseClient, appointmentId, userStatus.user]);

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

      <Stack spacing={4} sx={{ marginBottom: "2vh" }} alignItems="center">
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
                  handleValueChange={() => {}}
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
                  onChange={() => {}}
                  isErr={false}
                  errMsg=""
                  readOnly={true}
                />
              </Box>

              {/* Date & Time */}
              <Box sx={ConfirmAppointmentStyle.TextField}>
                <DisplayDateTime
                  header="Date & Time"
                  value={`${appointment.detailHeader.startDateTime} - ${appointment.detailHeader.endDateTime}`}
                  readOnly={true}
                />
              </Box>

              {/* Tags */}
              <Box sx={ConfirmAppointmentStyle.TextField}>
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
              <Box sx={ConfirmAppointmentStyle.TextField}>
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
          <Card sx={ConfirmAppointmentStyle.Card}>
            <Stack spacing={3} alignItems="center" justifyContent="center">
              {/* Image list */}
              {appointment.images.length !== 0 && (
                <Box sx={ConfirmAppointmentStyle.TextField}>
                  <DisplayImages header="Image" images={appointment.images} />
                </Box>
              )}

              {/* Number of participants */}
              <Box sx={ConfirmAppointmentStyle.TextField}>
                <Typography variant="h3">{`Number of Participant : ${appointment.acceptParticipants.length}`}</Typography>
              </Box>

              {/* Participant List */}
              <Stack
                spacing={0.5}
                alignItems="start"
                justifyContent="center"
                sx={ConfirmAppointmentStyle.TextField}
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
                    <Participant participant={userStatus.user} color={COLOR_CODE.PRIMARY} />
                  </Grid>
                  {appointment.acceptParticipants
                    .filter((p) => p.userId !== userStatus.user?.userId)
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

        <Stack direction="row" spacing={4}>
          <CommonButton label="Accept" onClick={handleOpenAcceptAppointmentModal} />
          <CommonButton
            label="Reject"
            color={COLOR.NATURAL}
            onClick={handleOpenRejectAppointmentModal}
          />
        </Stack>
      </Stack>

      <CommonDialog
        openModal={openAcceptAppointmentModal}
        handleCloseModal={handleCloseAcceptAppointmentModal}
        header={["Are you sure to", "accept", "this appointment ?"]}
        hightlightColorCode={COLOR_CODE.ACCEPT}
        content="*You can’t undo this change"
        buttonLabel="Accept"
        buttonColor={COLOR.PRIMARY}
        buttonAction={handleAcceptAppointment}
      />

      <CommonDialog
        openModal={openRejectAppointmentModal}
        handleCloseModal={handleCloseRejectAppointmentModal}
        header={["Are you sure to", "reject", "this appointment ?"]}
        content="*You can’t undo this change"
        buttonLabel="Reject"
        buttonColor={COLOR.ERROR}
        buttonAction={handleRejectAppointment}
      />
    </>
  );
}
