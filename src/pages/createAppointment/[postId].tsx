import Navbar from "@/components/public/Navbar";
import { Box, Link, Typography, Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { userContext } from "supabase/user_context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import Loading from "@/components/public/Loading";
import { PagePaths } from "enum/pages";
import { GetPostByPostId } from "@/services/Posts";
import { CreateAppointment } from "@/services/Appointments";
import LeftCard from "@/components/createAppointment/LeftCard";
import RightCard from "@/components/createAppointment/RightCard";
import { User } from "@/types/User";
import { PostInfo } from "@/types/Post";

// const mockParticipants: User[] = [
//   {
//     userId: "id1",
//     username: "เสี่ยโอ",
//     sex: "male",
//     birthdate: "28-07-1959",
//     description: "เจ้าชู้\nชอบขับเครื่องบินไปเที่ยว\nมีแฟนหลายคนเยอะ",
//     image: "https://i.im.ge/2023/02/28/77PS0P.download.jpg",
//     email: "siaO@gmail.com",
//     isAdmin: false,
//   },
//   {
//     userId: "id2",
//     username: "เสี่ยที",
//     sex: "male",
//     birthdate: "12-05-1990",
//     description: "แองกรี้เบิร์ด",
//     image: "https://i.im.ge/2023/02/28/77fcLJ.EWwNZFtXsAA7Iw9.jpg",
//     email: "siaT@gmail.com",
//     isAdmin: false,
//   },
//   {
//     userId: "id3",
//     username: "Monk God",
//     sex: "female",
//     birthdate: "30-10-1980",
//     description: "รวย",
//     image: null,
//     email: "MonkGod@gmail.com",
//     isAdmin: false,
//   },
//   {
//     userId: "id4",
//     username: "อุบลราชธานี",
//     sex: "male",
//     birthdate: "14-04-1999",
//     description: "ชอบเล่นติ๊กต๊อก",
//     image: null,
//     email: "Ubon@gmail.com",
//     isAdmin: false,
//   },
//   {
//     userId: "id5",
//     username: "ไอบอด",
//     sex: "male",
//     birthdate: "05-12-1900",
//     description: "ชอบเล่นเกมยิงปืน",
//     image: null,
//     email: "Ibod@hotmail.com",
//     isAdmin: false,
//   },
// ];

export default function Home() {
  const router = useRouter();
  const supabaseClient = useSupabaseClient<Database>();
  const userStatus = useContext(userContext);
  const [postInfo, setPostInfo] = useState<PostInfo | null>(null);
  const [availableParticipants, setAvailableParticipants] = useState<User[] | null>(null);
  const [selectedParticipants, setSelectedParticipants] = useState<User[]>([]);
  const [participantCountError, setParticipantCountError] = useState<boolean>(false);

  function handleClickBack() {
    router.back();
  }

  function handleParticipantsChange(participants: User[]): void {
    setParticipantCountError(false);
    setSelectedParticipants(participants);
  }

  function onSubmit() {
    if (selectedParticipants.length == 0) {
      setParticipantCountError(true);
      return;
    }

    if (postInfo && availableParticipants) {
      CreateAppointment(
        postInfo,
        availableParticipants,
        selectedParticipants,
        supabaseClient
      ).catch((err) => {
        console.log(err);
        return;
      });
    }
  }

  useEffect(() => {
    if (!router.query.postId || !userStatus.user) return;

    const postId = parseInt(router.query.postId as string);
    GetPostByPostId(userStatus.user, postId, supabaseClient)
      .then((p) => {
        setPostInfo(p);
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  }, [supabaseClient, router.query.postId, userStatus.user]);

  if (userStatus.isLoading) return <Loading />;
  if (!userStatus.user) {
    router.push(PagePaths.login);
    return;
  }
  if (!postInfo || !availableParticipants) return <Loading />;
  return (
    <>
      <Navbar />
      {/*  ArrowBackIcon */}
      <Box display="flex" paddingBottom="40px">
        <Link>
          <ArrowBackIcon
            fontSize="large"
            sx={{ position: "absolute", margin: "3vh 0 0 3vh", color: "black" }}
            onClick={handleClickBack}
          />
        </Link>
      </Box>
      {/*  Title */}
      <Box>
        <Typography variant="h1" sx={{ fontWeight: "700", fontSize: "40px" }}>
          Create Appointment
        </Typography>
      </Box>
      {/*  Left and Right Card */}
      <Box display="flex" justifyContent="center" padding="40px">
        <Grid container spacing="40px" width="80vw">
          {/*  Left Card */}
          <Grid item xs={12} md={6} style={{ display: "flex" }}>
            <LeftCard postInfo={postInfo} isUnClick={true} />
          </Grid>
          {/*  Right Card */}
          <Grid item xs={12} md={6} style={{ display: "flex" }}>
            <RightCard
              images={postInfo.images}
              availableParticipants={availableParticipants}
              selectedParticipants={selectedParticipants}
              onSubmit={onSubmit}
              participantCountError={participantCountError}
              handleParticipantsChange={handleParticipantsChange}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
