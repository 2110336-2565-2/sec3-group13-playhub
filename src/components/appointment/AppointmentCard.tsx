import { Appointment } from "@/types/Appointment";
import {
  Card,
  Avatar,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import { PagePaths } from "enum/pages";
import router from "next/router";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";

type props = {
  appointment: Appointment;
};
export default function AppointmentCard(props: props) {
  return (
    <Card sx={{ width: "100%", height: "220px" }}>
      <CardHeader
        avatar={
          <IconButton
            onClick={() => {
              router.push(PagePaths.profile + props.appointment.ownerId);
            }}
            sx={{ padding: "0px" }}
          >
            <Avatar
              sx={{ width: "50px", height: "50px" }}
              alt="Profile picture"
              src={props.appointment.ownerProfilePic}
            />
          </IconButton>
        }
        title={props.appointment.title}
        subheader={"by " + props.appointment.ownerName}
        titleTypographyProps={{ variant: "h5" }}
        subheaderTypographyProps={{ variant: "h6" }}
      />
      <CardContent sx={{ paddingLeft: "80px" }}>
        <Stack spacing="4px">
          <Typography display="inline-flex">
            <LocationOnIcon fontSize="medium" />
            <Typography
              style={{
                marginLeft: 8,
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {props.appointment.location}
            </Typography>
          </Typography>
          <Typography display="inline-flex">
            <CalendarTodayIcon fontSize="medium" />
            <Typography style={{ marginLeft: 8 }}>
              {props.appointment.startDateTime.format("DD/MM/YYYY HH:mm A")} -{" "}
              {props.appointment.endDateTime.format("DD/MM/YYYY HH:mm A")}
            </Typography>
          </Typography>
          <Typography display="inline-flex">
            <PersonIcon fontSize="medium" />
            <Typography style={{ marginLeft: 8 }}>
              Number of Participant : {props.appointment.participantAmount}
            </Typography>
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
