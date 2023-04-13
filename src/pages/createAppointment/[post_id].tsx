import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";

import { userContext } from "supabase/user_context";
import { Typography, Stack, Box, Card, IconButton, FormHelperText } from "@mui/material";

import Loading from "@/components/public/Loading";
import Navbar from "@/components/public/Navbar";
import Tags from "@/components/post/SelectTags";

import { PAGE_PATHS } from "enum/PAGES";
import { PostInfo } from "@/types/Post";
import DescriptionTextField from "@/components/public/DescriptionTextField";
import LocationTextField from "@/components/post/LocationTextField";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TitleTextField from "@/components/post/TitleTextField";
import { User } from "@/types/User";
import DisplayDateTime from "@/components/appointment/DisplayDateTime";

import { Service } from "@/services";
import DisplayImages from "@/components/post/DisplayImages";
import SelectParticipants from "@/components/appointment/SelectParticipants";
import CommonButton from "@/components/public/CommonButton";

const CreatePostStyle = {
  TextField: {
    width: "28vw",
    minWidth: "400px",
  },
  Card: {
    width: "30vw",
    minWidth: "450px",
    height: "75vh",
    minHeight: "785px",
    paddingTop: "2vh",
  },
};

export default function Home() {
  const service = new Service();
  const router = useRouter();
  const userStatus = useContext(userContext);

  const [postInfo, setPostInfo] = useState<PostInfo | null>(null);
  const [availableParticipants, setAvailableParticipants] = useState<User[] | null>(null);
  const [selectedParticipants, setSelectedParticipants] = useState<User[]>([]);
  const [participantCountError, setParticipantCountError] = useState<boolean>(false);
  const [isCreatingAppointment, setIsCreatingAppointment] = useState<boolean>(false);

  const postId = parseInt(router.query.post_id as string);

  function handleAddParticipant(participant: User): void {
    setParticipantCountError(false);
    if (availableParticipants) {
      setAvailableParticipants(availableParticipants.filter((p) => p !== participant));
    }
    setSelectedParticipants([...selectedParticipants, participant]);
  }

  function handleDeleteParticipant(participant: User): void {
    setParticipantCountError(false);
    if (availableParticipants) {
      setAvailableParticipants([...availableParticipants, participant]);
    }
    setSelectedParticipants(selectedParticipants.filter((p) => p !== participant));
  }

  function handleSubmit() {
    if (selectedParticipants.length == 0) {
      setParticipantCountError(true);
      return;
    }

    if (postInfo) {
      setIsCreatingAppointment(true);
      service.appointment
        .CreateAppointment(postId, postInfo, selectedParticipants)
        .then(() => {
          router.push(PAGE_PATHS.MY_APPOINTMENTS);
          return;
        })
        .catch((err: any) => {
          console.log(err);
          setIsCreatingAppointment(false);
          return;
        });
    }
  }

  useEffect(() => {
    if (!postId || !userStatus.user) return;
    service.post
      .GetPostWithParticipantsByPostId(postId)
      .then((p: PostInfo) => {
        setPostInfo(p);
        if (!p.participants) return;
        setAvailableParticipants(
          p.participants.filter((e) => e.userId !== userStatus.user?.userId)
        );
      })
      .catch((err: any) => {
        console.log(err);
        router.push(PAGE_PATHS.CREATE_APPOINTMENT);
        return;
      });
  }, [postId, userStatus.user, router]);

  function backToPost(): void {
    router.push(PAGE_PATHS.POST + router.query.post_id);
    return;
  }

  if (userStatus.isLoading) return <Loading />;
  if (!userStatus.user) {
    router.push(PAGE_PATHS.LOGIN);
    return;
  }
  if (userStatus.user.isAdmin) {
    router.push(PAGE_PATHS.ADMIN_HOME + userStatus.user.userId);
    return;
  }
  if (!userStatus.user.isVerified) {
    router.push(PAGE_PATHS.HOME);
    return;
  }
  if (!postInfo || !availableParticipants) return <Loading />;
  return (
    <>
      <Navbar />
      {isCreatingAppointment && <Loading />}
      <IconButton
        onClick={backToPost}
        style={{ position: "absolute", top: 86, left: 20, zIndex: "1" }}
      >
        <ArrowBackIcon fontSize="large" color="secondary" />
      </IconButton>

      <Stack spacing={4} sx={{ marginBottom: "3vh" }} alignItems="center">
        {/* Page header */}
        <Box sx={{ marginTop: "3vh" }}>
          <Typography variant="h1">Create Appointment</Typography>
        </Box>

        <Stack spacing={5} direction="row">
          <Card sx={CreatePostStyle.Card}>
            <Stack spacing={0} alignItems="center" justifyContent="center">
              {/* Post title */}
              <Box style={CreatePostStyle.TextField}>
                <TitleTextField
                  name="title"
                  header="Title"
                  placeholder="This is Post Title"
                  value={postInfo?.title ? postInfo?.title : ""}
                  handleValueChange={() => {}}
                  isErr={false}
                  errMsg=""
                  disabled={true}
                />
              </Box>

              {/* Location */}
              <Box sx={CreatePostStyle.TextField}>
                <LocationTextField
                  header="Location"
                  placeholder="Enter Location"
                  initialValue={postInfo?.location ? postInfo?.location : ""}
                  onChange={() => {}}
                  isErr={false}
                  errMsg=""
                  disabled={true}
                />
              </Box>

              {/* Date & Time */}
              <Box sx={CreatePostStyle.TextField}>
                <DisplayDateTime
                  header="Date & Time"
                  value={
                    postInfo?.startTime && postInfo?.endTime
                      ? `${postInfo?.startTime} - ${postInfo?.endTime}`
                      : ""
                  }
                />
              </Box>

              {/* Tags */}
              <Box sx={CreatePostStyle.TextField}>
                <Tags
                  header="Tag"
                  value={postInfo?.tags}
                  handleValueChange={() => {}}
                  menuValue={[]}
                  isErr={false}
                  errMsg=""
                  disabled={true}
                />
                <FormHelperText>{"\u00A0"}</FormHelperText>
              </Box>

              {/* Description */}
              <Box sx={CreatePostStyle.TextField}>
                <DescriptionTextField
                  name="description"
                  header="Description"
                  placeholder="Enter Description Here"
                  value={postInfo?.description}
                  handleValueChange={() => {}}
                  isErr={false}
                  errMsg=""
                  height={8}
                  disabled={true}
                />
              </Box>
            </Stack>
          </Card>
          <Card sx={CreatePostStyle.Card}>
            <Stack
              sx={{
                height: "75vh",
                minHeight: "750px",
              }}
              justifyContent="space-between"
            >
              <Stack spacing={3} alignItems="center" justifyContent="center">
                {/* Image list */}
                {postInfo.images.length !== 0 && (
                  <Box sx={CreatePostStyle.TextField}>
                    <DisplayImages header="Image" images={postInfo.images} />
                  </Box>
                )}

                {/* Participant */}
                <Box sx={CreatePostStyle.TextField}>
                  <SelectParticipants
                    header="Select Participants"
                    availableParticipants={availableParticipants}
                    selectedParticipants={selectedParticipants}
                    handleAddParticipant={handleAddParticipant}
                    handleDeleteParticipant={handleDeleteParticipant}
                    participantCountError={participantCountError}
                  />
                </Box>
              </Stack>

              {/* Submit button */}
              <Box display="flex" sx={{ justifyContent: "center" }}>
                <CommonButton label="Create" onClick={handleSubmit} />
              </Box>
            </Stack>
          </Card>
        </Stack>
      </Stack>
    </>
  );
}
