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
import { GetPostWithParticipantsByPostId } from "@/services/Posts";
import { CreateAppointment } from "@/services/Appointments";
import LeftCard from "@/components/createAppointment/LeftCard";
import PostInfoCard from "@/components/createAppointment/PostInfoCard";
import { User } from "@/types/User";
import { PostInfo } from "@/types/Post";

export default function Home() {
  const router = useRouter();
  const supabaseClient = useSupabaseClient<Database>();
  const userStatus = useContext(userContext);
  const [postInfo, setPostInfo] = useState<PostInfo | null>(null);
  const [availableParticipants, setAvailableParticipants] = useState<User[] | null>(null);
  const [selectedParticipants, setSelectedParticipants] = useState<User[]>([]);
  const [participantCountError, setParticipantCountError] = useState<boolean>(false);
  const [isCreatingAppointment, setIsCreatingAppointment] = useState<boolean>(false);

  const postId = parseInt(router.query.postId as string);

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

    if (postInfo) {
      setIsCreatingAppointment(true);
      CreateAppointment(postId, postInfo, selectedParticipants, supabaseClient)
        .then(() => {
          // router.push(PagePaths.myAppointments);
          return;
        })
        .catch((err) => {
          console.log(err);
          return;
        })
        .finally(() => {
          setIsCreatingAppointment(true);
        });
    }
  }

  useEffect(() => {
    if (!postId || !userStatus.user) return;
    GetPostWithParticipantsByPostId(postId, supabaseClient)
      .then((p) => {
        setPostInfo(p);
        if (!p.participants) return;
        setAvailableParticipants(p.participants.filter((e) => e.userId != userStatus.user?.userId));
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  }, [supabaseClient, postId, userStatus.user]);

  if (userStatus.isLoading) return <Loading />;
  if (!userStatus.user) {
    router.push(PagePaths.login);
    return;
  }
  if (!postInfo || !availableParticipants) return <Loading />;
  return (
    <>
      <Navbar />
      {isCreatingAppointment && <Loading />}
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
            <PostInfoCard
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
