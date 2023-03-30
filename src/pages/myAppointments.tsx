import AppointmentCard from "@/components/appointment/AppointmentCard";
import Navbar from "@/components/public/Navbar";
import { GetAppointmentsByUserId } from "@/services/Appointment";
import { Appointment } from "@/types/Appointment";
import { Typography, Grid, Box, Stack } from "@mui/material";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useContext, useEffect, useState } from "react";
import { Database } from "supabase/db_types";
import { userContext } from "supabase/user_context";
import { NextRouter, useRouter } from "next/router";
import { PAGE_PATHS } from "enum/PAGES";
import Loading from "@/components/public/Loading";
import AdvertiseCard from "@/components/public/AdvertiseCard";
import { Advertise } from "@/types/Advertisement";
import { ADVERTISE_CONFIG } from "enum/ADVERTISE";
import { GetAdvertisementUrl } from "@/services/Advertisement";
import { isShowAdvertise } from "@/utilities/advertise";

export default function Home() {
    const router: NextRouter = useRouter();

    const supabaseClient = useSupabaseClient<Database>();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const userStatus = useContext(userContext);

    const [advertise, setAdvertise] = useState<Advertise[] | null>()
    const freqOfAdvertise = ADVERTISE_CONFIG.FREQUENCY_OF_ADVERTISE

    function handleCardClick(appointmentId: string): void {
        router.push(PAGE_PATHS.MY_APPOINTMENTS + appointmentId);
        return;
    }

    useEffect(() => {
        if (!userStatus.user) return;

        GetAppointmentsByUserId(userStatus.user.userId, supabaseClient).then((appointment) => {
            setAppointments(appointment);
        }).catch((err) => {
            console.log(err)
            return;
        })

        GetAdvertisementUrl(supabaseClient)
            .then((p) => {
                setAdvertise(p)
                console.log(p)
            }).catch((err) => {
                console.log(err)
                return
            })

    }, [supabaseClient, userStatus.user]);

    if (userStatus.isLoading) return <Loading />;
    if (!userStatus.user) {
        router.push(PAGE_PATHS.LOGIN);
        return;
    }
    return (
        <>
            <Navbar />
            <Stack spacing={4} alignItems="center">

                <Typography paddingTop="40px" variant="h4" align="center">My Appointments</Typography>
                <Grid
                    container
                    justifyContent="space-between"
                    rowSpacing={6}
                    style={{ width: "80vw", marginTop: -6, marginBottom: "30px" }}
                >
                    {appointments.map((item, index) => (
                        <>
                            <Grid item xs={12} md={6} key={index}>
                                <div onClick={() => handleCardClick(item.appointmentId)}>
                                    <AppointmentCard appointment={item} />
                                </div>
                            </Grid>
                            {advertise && isShowAdvertise(index, appointments.length) &&
                                <AdvertiseCard src={advertise[Math.min(Math.floor(index / freqOfAdvertise), advertise.length - 1)].image_url} />
                            }
                        </>
                    ))}
                </Grid>
            </Stack>
        </>
    );
}
