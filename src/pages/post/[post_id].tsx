import Navbar from "@/components/public/Navbar";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { PAGE_PATHS } from "enum/PAGES";
import { useRouter } from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CommonButton from "@/components/public/CommonButton";
import { COLOR } from "enum/COLOR";
import { userContext } from "supabase/user_context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { useContext, useEffect, useState } from "react";
import { GetPostWithParticipantsByPostId, DeletePost } from "@/services/Posts";
import { PostInfo } from "@/types/Post";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import dayjs from "dayjs";
import DisplayTags from "@/components/post/DisplayTags";
import DisplayImages from "@/components/post/DisplayImages";
import DeletePostDialog from "@/components/post/DeletePostDialog";
import { User } from "@/types/User";
import Participant from "@/components/post/Participant";
import Loading from "@/components/public/Loading";
import CommonDialog from "@/components/public/CommonDialog";

const PostStyle = {
  Card: {
    width: "30vw",
    minWidth: "300px",
    height: "70vh",
    minHeight: "710px",
    paddingTop: "2vh",
  },
};

export default function Home() {
  const router = useRouter();
  const userStatus = useContext(userContext);
  const supabaseClient = useSupabaseClient<Database>();

  const [post, setPost] = useState<PostInfo>({
    title: "",
    userId: "",
    location: "",
    tags: [],
    description: "",
    images: [],
    startTime: dayjs(new Date()),
    endTime: dayjs(new Date()),
  });
  const [participants, setParticipants] = useState<User[]>([]);
  const [openDeletePostModal, setOpenDeletePostModal] = useState<boolean>(false);

  const handleOpenDeletePostModal = (): void => setOpenDeletePostModal(true);
  const handleCloseDeletePostModal = (): void => setOpenDeletePostModal(false);

  function handleCreateAppointment() {
    router.push(PAGE_PATHS.CREATE_APPOINTMENT);
  }

  function handleDelete() {
    DeletePost(Number(router.query.post_id), supabaseClient)
      .then(() => {
        handleCloseDeletePostModal();
        router.push(PAGE_PATHS.MY_POSTS);
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  }

  function handleEditPost(): void {
    router.push(PAGE_PATHS.EDIT_POST + router.query.post_id);
  }

  function backToMyPost(): void {
    router.push(PAGE_PATHS.MY_POSTS);
  }

  useEffect(() => {
    if (!userStatus.user) return;
    GetPostWithParticipantsByPostId(Number(router.query.post_id), supabaseClient)
      .then((p) => {
        setPost(p);
        if (!p.participants) return;
        setParticipants(p.participants.filter((e: User) => e.userId != userStatus.user?.userId));
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  }, [userStatus.user, router.query.post_id, supabaseClient]);


  if (userStatus.isLoading) return <Loading />;
  if (!userStatus.user) {
    router.push(PAGE_PATHS.LOGIN);
    return;
  }
  if (!post || !participants) return <Loading />;
  return (
    <>
      <Navbar />

      <IconButton
        onClick={backToMyPost}
        style={{ position: "absolute", top: 86, left: 20, zIndex: "1" }}
      >
        <ArrowBackIcon fontSize="large" color="secondary" />
      </IconButton>

      <Stack spacing={4} sx={{ marginBottom: "2vh", }} alignItems="center">
        {/* Page header */}
        <Box sx={{ marginTop: "3vh" }}>
          <Typography variant="h1">{post.title}</Typography>
        </Box>

        <Stack spacing={5} direction="row">
          <Card sx={PostStyle.Card}>
            {/* avartar */}
            <CardHeader
              style={{ paddingTop: 0 }}
              avatar={
                <IconButton
                  onClick={() => {
                    router.push(PAGE_PATHS.PROFILE + userStatus.user?.userId);
                  }}
                  sx={{ padding: 0 }}
                >
                  <Avatar
                    sx={{ width: 50, height: 50, zIndex: "1" }}
                    alt="Profile picture"
                    src={userStatus.user?.image as string}
                  />
                </IconButton>
              }
              title={userStatus.user?.username}
              titleTypographyProps={{ variant: "body1", align: "left" }}
            />
            <CardContent style={{ paddingTop: 0 }}>
              <Stack spacing={2} alignItems="start" justifyContent="center">
                {/* location */}
                <Stack spacing={2} direction="row" alignItems="center">
                  <LocationOnIcon fontSize="large" />
                  <Typography variant="body1">{post.location}</Typography>
                </Stack>

                {/* date */}
                <Stack spacing={2} direction="row" alignItems="center">
                  <CalendarTodayIcon fontSize="large" />
                  <Typography variant="body1">
                    {post.startTime.format("DD/MM/YYYY h:mm A")} -{" "}
                    {post.endTime.format("DD/MM/YYYY h:mm A")}
                  </Typography>
                </Stack>

                {/* tags */}
                <DisplayTags tags={post.tags.map((tag) => tag.name)} />

                {/* description */}
                <Stack spacing={0}>
                  {post.description.split("\n").map((row, index) => (
                    <Typography
                      variant="body1"
                      sx={{
                        maxWidth: "30vw",
                        wordBreak: "break-word",
                        textAlign: "start",
                      }}
                      key={index}
                    >
                      {row}
                    </Typography>
                  ))}
                </Stack>

                {/* images */}
                {post.description.split("\n").length < 6 && <DisplayImages images={post.images} />}
              </Stack>
            </CardContent>
          </Card>
          <Card sx={PostStyle.Card}>
            <CardContent style={{ paddingTop: 0 }}>
              <Stack spacing={2} alignItems="start" justifyContent="center">
                {/* images */}
                {post.description.split("\n").length > 5 && <DisplayImages images={post.images} />}

                {/* participants */}
                <Stack spacing={1} alignItems="start" justifyContent="center">
                  <Typography variant="h2">Join with</Typography>
                  <Box display="flex">
                    {post.participants?.length == 0 && (
                      <Typography variant="body1" color="error">
                        No one is interested in this activity yet.
                      </Typography>
                    )}
                  </Box>
                  <Grid container spacing={1} style={{ marginLeft: -5 }}>
                    {post.participants?.map((participant, index) => (
                      <Grid item key={index}>
                        <Participant participant={participant} />
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        <Stack direction="row" spacing={4}>
          <CommonButton
            label="Delete Post"
            color={COLOR.ERROR}
            onClick={handleOpenDeletePostModal}
          />
          <CommonButton label="Edit Post" onClick={handleEditPost} />
          <CommonButton
            label="Create Appointment"
            onClick={handleCreateAppointment}
          />
        </Stack>
      </Stack>

      <CommonDialog
        openModal={openDeletePostModal}
        handleCloseModal={handleCloseDeletePostModal}
        header={["Are you sure to", "delete", "this post ?"]}
        content="*This action cannot be undone."
        buttonLabel="Delete"
        buttonColor={COLOR.ERROR}
        buttonAction={handleDelete}
      />
    </>
  );
}
