import AppointmentCard from "@/components/appointment/AppointmentCard";
import Navbar from "@/components/public/Navbar";
import { Appointment, testAppointment } from "@/types/Appointment";
import { Typography, Grid, Stack, Box } from "@mui/material";
export default function Home() {
    var appointments: Appointment[] = Array(7).fill(testAppointment);
    return <>
        <Navbar />
        <Typography paddingTop="40px" variant="h4" align="center">My Appointments</Typography>
        <Box
            display="flex"
            justifyContent="center"
            padding="40px"
        >
            <Grid container
                spacing="40px"
                width="80vw"
            >
                {appointments.map((item, index) => (
                    <Grid item xs={12} md={6} key={index}>
                        <AppointmentCard appointment={item} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    </>;
}