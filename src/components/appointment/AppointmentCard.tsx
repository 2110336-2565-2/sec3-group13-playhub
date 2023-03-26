import { Appointment } from "@/types/Appointment";
import {
  Card,
  Avatar,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  Typography,
  CardActionArea,
} from "@mui/material";

import { PAGE_PATHS, ROLE } from "enum/PAGES";
import { NextRouter, useRouter } from "next/router";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import dayjs from "dayjs";
import { useContext } from "react";
import { userContext } from "supabase/user_context";

type props = {
  appointment: Appointment;
  prefix: string;
};

export default function AppointmentCard(props: props) {
  const router: NextRouter = useRouter();
  const userStatus = useContext(userContext);

  function goToCardDetail() {
    if (props.prefix === PAGE_PATHS.APPOINTMENT) {
      if (props.appointment.ownerId === userStatus.user?.userId) {
        router.push(props.prefix + ROLE.HOST + props.appointment.appointmentId);
        return;
      } else {
        router.push(props.prefix + ROLE.PARTICIPANT + props.appointment.appointmentId);
        return;
      }
    }
    router.push(props.prefix + props.appointment.appointmentId);
    return;
  }


  return (
    <Card sx={{ borderRadius: "30px" }}>
      <CardActionArea onClick={goToCardDetail}>
        {/* Appointment Card Header */}
        <CardHeader
          sx={{ height: "6vh" }}
          avatar={
            <IconButton
              onClick={() => {
                router.push(PAGE_PATHS.PROFILE + props.appointment.ownerId);
                return;
              }}
              sx={{ padding: 0 }}
            >
              <Avatar
                sx={{ width: 50, height: 50, zIndex: "1" }}
                alt="Profile picture"
                src={props.appointment.ownerProfilePic}
              />
            </IconButton>
          }
          title={
            <Typography
              variant="h1"
              align="left"
              display="block"
              sx={{
                width: "31vw",
                minWidth: "400px",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}>
              {props.appointment.title}
            </Typography>}
          subheader={
            <Typography
              variant="body1"
              align="left"
              display="block"
              sx={{
                width: "31vw",
                minWidth: "400px",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}>
              {props.appointment.ownerName}
            </Typography>}
        />
        <CardContent style={{ height: "13vh", minHeight: "120px", paddingLeft: 82, paddingTop: 0 }}>
          <Stack spacing={2} marginBottom={2}>
            {/* location */}
            <Typography variant="body1" display="inline-flex">
              <LocationOnIcon fontSize="medium" />
              <Typography style={{ marginLeft: 8 }}
                sx={{
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}>{props.appointment.location}</Typography>
            </Typography>

            {/* date */}
            <Typography variant="body1" display="inline-flex">
              <CalendarTodayIcon fontSize="medium" />
              <Typography style={{ marginLeft: 8 }}
                sx={{
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}>
                {dayjs(props.appointment.startDateTime).format("DD/MM/YYYY h:mm A")} -{" "}
                {dayjs(props.appointment.endDateTime).format("DD/MM/YYYY h:mm A")}
              </Typography>
            </Typography>

            {/* number of participants */}
            <Typography variant="body1" display="inline-flex">
              <PersonIcon fontSize="medium" />
              <Typography style={{ marginLeft: 8 }}>
                Number of Participant : {props.appointment.participantAmount}
              </Typography>
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card >
  );
}
