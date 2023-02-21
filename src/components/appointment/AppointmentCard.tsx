import { Appointment } from "@/types/Appointment";
import { Avatar, CardContent, CardHeader, IconButton, Stack, Typography } from "@mui/material";
import { PagePaths } from "enum/pages";
import router from "next/router";
import BorderWithShadow from "../public/BorderWithShadow";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from '@mui/icons-material/Person';

type props = {
    appointment: Appointment;
};
export default function AppointmentCard(props: props) {
    return <BorderWithShadow>
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
            title="This is title"
            subheader={"by " + props.appointment.ownerName}
            titleTypographyProps={{ variant: "h5" }}
            subheaderTypographyProps={{ variant: "h6" }}

        />
        <CardContent
            sx={{ paddingLeft: "80px" }}
        >
            <Stack spacing="4px">
                <Typography display="inline-flex">
                    <LocationOnIcon fontSize="medium" />
                    <span style={{ marginLeft: 8 }}>{props.appointment.location}</span>
                </Typography>
                <Typography display="inline-flex">
                    <CalendarTodayIcon fontSize="medium" />
                    <span style={{ marginLeft: 8 }}>
                        {props.appointment.startDateTime} - {props.appointment.endDateTime}
                    </span>
                </Typography>
                <Typography display="inline-flex">
                    <PersonIcon fontSize="medium" />
                    <span style={{ marginLeft: 8 }}>
                        Number of Participant : {props.appointment.participantAmount}
                    </span>
                </Typography>
            </Stack>
        </CardContent>
    </BorderWithShadow>;
}