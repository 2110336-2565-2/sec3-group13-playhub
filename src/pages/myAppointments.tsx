import AppointmentCard from "@/components/appointment/AppointmentCard";
import Navbar from "@/components/public/Navbar";
import { GetAppointmentsByUserId } from "@/services/Appointment";
import { Appointment } from "@/types/Appointment";
import { Typography, Grid, Box } from "@mui/material";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useContext, useEffect, useState } from "react";
import { Database } from "supabase/db_types";
import { userContext } from "supabase/user_context";

export default function Home() {

    const supabaseClient = useSupabaseClient<Database>();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const userStatus = useContext(userContext);

    useEffect(() => {
        if (!userStatus.user) return;

        GetAppointmentsByUserId(userStatus.user.userId, supabaseClient).then((appointment) => {
            setAppointments(appointment);
        }).catch((err) => {
            console.log(err)
            return;
        })

    }, [supabaseClient, userStatus.user]);

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