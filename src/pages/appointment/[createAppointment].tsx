
import Navbar from "@/components/public/Navbar";
import { Box, Link, Typography, Grid, Stack, CardContent } from "@mui/material";

import { AppointmentDetailHeader, AppointmentDetail } from "@/types/Appointment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { NextRouter, useRouter } from "next/router";

import { useEffect, useState, useContext, ChangeEvent } from "react";
import { Dayjs } from "dayjs";


import { userContext } from "supabase/user_context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";



import Loading from "@/components/public/Loading";
import CommonTextField from "@/components/public/CommonTextField";
import CommonDateTimePicker from "@/components/public/CommonDateTimePicker";
import Tags from "@/components/createPost/Tags";
import GoogleMap from "@/components/createPost/searchMaps";
import PictureList from "@/components/createPost/pictureList";

import { Tag } from "@/types/Tag";
import { PagePaths } from "enum/pages";
import { CHAR_LIMIT } from "enum/inputLimit";

import {
    validateDate,
    validateDateWithInterval,
    validateTextField,
} from "@/utilities/validation";
import { validation } from "@/types/Validation";
import { GetAllTags, GetTagsByPost } from "@/services/Tags";
import { PostInfo } from "@/types/Post";
import { GetPostByPostId, UpdatePost } from "@/services/Posts";
import LeftCard from "@/components/createAppointment/LeftCard";
import RightCard from "@/components/createAppointment/RightCard";
import { User } from "@/types/User";
const MainLayout = {
    margin: "1vh 0 0 0",
    border: "1px dashed grey",
    textAlign: "center",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
    padding: "40px",
};




type props = {
    appointmentDetail: AppointmentDetail,
};
{ ["เสี่ยโอ", "เสี่ยที", "Monk God", "อุบลราชธานี", "ไอบอด"] }
const person: User[] = [
    {
        userId: 1,
        username: "เสี่ยโอ",
        sex: 'เกย์ตุ๋ยตูดเด็ก',
        birthdate: "28-07-1959",
        description: "เจ้าชู้",
        image: null,
        email: "siaO@gmail.com",
        isAdmin: false
    },
    {
        userId: 2,
        username: "เสี่ยที",
        sex: 'ชาย',
        birthdate: "12-05-1990",
        description: "แองกรี้เบิร์ด",
        image: null,
        email: "siaT@gmail.com",
        isAdmin: false
    },
    {
        userId: 3,
        username: "Monk God",
        sex: 'ชาย',
        birthdate: "30-10-1980",
        description: "รวย",
        image: null,
        email: "MonkGod@gmail.com",
        isAdmin: false
    },
    {
        userId: 4,
        username: "อุบลราชธานี",
        sex: 'หญิง',
        birthdate: "14-04-1999",
        description: "ชอบเล่นติ๊กต๊อก",
        image: null,
        email: "Ubon@gmail.com",
        isAdmin: false
    },
    {
        userId: 5,
        username: "ไอบอด",
        sex: 'ชาย',
        birthdate: "05-12-1900",
        description: "บอสใหญ่สุด",
        image: null,
        email: "Ibod@hotmail.com",
        isAdmin: false
    },

]
const isCreate = true;
export default function Home(props: props) {
    //const [participant, setParticipant] = useState<string>([]);


    const router = useRouter();
    const userStatus = useContext(userContext);
    const supabaseClient = useSupabaseClient<Database>();

    const postId = parseInt(router.query.createAppointment as string);

    const [title, setTitle] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [tags, setTags] = useState<Tag[]>([]);
    const [description, setDescription] = useState<string>("");
    const [images, setImages] = useState<string[]>([]);
    /*function handleParticipantChange(newParticipant: []): void {
        setParticipant(newParticipant);
    }*/



    useEffect(() => {
        GetAllTags(supabaseClient)
            .then()
            .catch((err) => console.log(err));
    }, [supabaseClient]);
    useEffect(() => {
        async function getPostData() {
            if (!postId || !userStatus.user) { console.log("error2"); return; }
            GetPostByPostId(userStatus.user, postId, supabaseClient)
                .then((p) => {
                    console.log(p)
                    setTitle(p.title);
                    setDescription(p.description);
                    setLocation(p.location);
                    setStartDate(p.startTime);
                    setEndDate(p.endTime);
                    setImages(p.images);
                    //setOriginalImages(p.images);
                    setTags(p.tags);
                    //setLoadingData(false);
                }).catch((err) => {
                    console.log(err)
                    return
                })
        }
        getPostData();
    }, [supabaseClient, router.query.post_id]);
    const leftSideData: AppointmentDetailHeader = {
        title: title,
        location: location,
        startDateTime: startDate,
        endDateTime: endDate,
        tags: tags,
        description: description
    }
    console.log(leftSideData)
    const rightSideData: AppointmentDetail = {
        detailHeader: leftSideData,
        images: images,
        participantAmount: 10,
        pendingParticipants: person,
        acceptParticipants: [],
        rejectParticipants: []

    }
    if (userStatus.isLoading) return <Loading />;
    if (!userStatus.user) {
        router.push(PagePaths.login);
        return;
    }



    return (
        <>
            <Navbar />
            <Box
                display="flex"
                paddingBottom="40px"
            >
                <Link>
                    <ArrowBackIcon
                        fontSize="large"
                        sx={{ position: "absolute", margin: "3vh 0 0 3vh", color: "black" }}
                    />
                </Link>
            </Box>
            <Box >
                <Typography variant="h1" sx={{ fontWeight: "700", fontSize: "40px" }}>
                    Create Appointment
                </Typography>
            </Box>
            <Box
                display="flex"
                justifyContent="center"
                padding="40px"
            >
                {/*isCreate ? <AppointmentHostCard appointmentDetail={mockData} />
                    : null*/}
                <Grid container
                    spacing="40px"
                    width="80vw"
                >
                    <Grid item xs={12} md={6} style={{ display: "flex" }}>
                        <LeftCard leftSideData={leftSideData}
                            isUnClick={true} />
                    </Grid>
                    <Grid item xs={12} md={6} style={{ display: "flex" }} >

                        <RightCard rightSideData={rightSideData} />
                    </Grid>

                </Grid>
            </Box>
        </>);
}
