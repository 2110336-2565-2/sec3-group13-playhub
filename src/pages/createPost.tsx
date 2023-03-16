import { useEffect, useState, useContext, ChangeEvent } from "react";
import { Dayjs } from "dayjs";
import { useRouter } from "next/router";

import { userContext } from "supabase/user_context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { Grid, Typography, Button, FormHelperText, Stack, Box, Card } from "@mui/material";

import Loading from "@/components/public/Loading";
import Navbar from "@/components/public/Navbar";
import NormalTextField from "@/components/public/NormalTextField";
import CommonTextField from "@/components/public/CommonTextField";
import CommonDateTimePicker from "@/components/post/CommonDateTimePicker";
import Tags from "@/components/createPost/Tags";
import GoogleMap from "@/components/createPost/searchMaps";
import PictureList from "@/components/createPost/pictureList";
import { validateDate, validateDateWithInterval, validateTextField } from "@/utilities/validation";

import { validation } from "@/types/Validation";
import { Tag } from "@/types/Tag";
import { PAGE_PATHS } from "enum/PAGES";
import { CHAR_LIMIT } from "enum/INPUT_LIMIT";

import { GetAllTags } from "@/services/Tags";
import { CreatePost } from "@/services/Posts";
import { PostInfo } from "@/types/Post";
import { ICONS } from "enum/ICONS";
import DescriptionTextField from "@/components/public/DescriptionTextField";
import LocationTextField from "@/components/post/LocationTextField";

type CreatePostInput = {
  title: string;
  location: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  tags: Tag[];
  description: string;
  images: string[];
};

type CreatePostSubmit = {
  title: boolean;
  location: boolean;
  date: boolean;
  tags: boolean;
  description: boolean;
  images: boolean;
};

const CreatePostStyle = {
  TextField: {
    width: "28vw",
    minWidth: "250px",
    // margin: "2vh 0 0 0",
  },
  Card: {
    width: "30vw",
    minWidth: "300px",
    height: "70vh",

    // marginTop: "3vh",
    // marginBottom: "3vh",

    paddingTop: "3vh",
    // paddingBottom: "15vh",
  },
};

export default function Home() {
  const router = useRouter();
  const userStatus = useContext(userContext);
  const supabaseClient = useSupabaseClient<Database>();

  const [input, setInput] = useState<CreatePostInput>({
    title: "",
    location: "",
    startDate: null,
    endDate: null,
    tags: [],
    description: "",
    images: [],
  });
  const [state, setState] = useState<CreatePostSubmit>({
    title: false,
    location: false,
    date: false,
    tags: false,
    description: false,
    images: false,
  });
  const [tagMenu, setTagMenu] = useState<Tag[]>([]);

  // error variables
  const titleError: validation = validateTextField(
    input.title,
    CHAR_LIMIT.MIN_TITLE,
    CHAR_LIMIT.MAX_TITLE
  );
  const locationError: boolean = input.location.trim() === "";
  const startDateError: validation = validateDate(input.startDate);
  const endDateError: validation = validateDateWithInterval(input.startDate, input.endDate);
  const tagsError: boolean = input.tags.length === 0;
  const descriptionError: validation = validateTextField(
    input.description,
    CHAR_LIMIT.MIN_DESCRIPTION,
    CHAR_LIMIT.MAX_DESCRIPTION
  );
  const imagesError: boolean = false;

  // input field change
  function handleTextFieldChange(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
    setState({ ...state, [event.target.name]: false });
    setInput({ ...input, [event.target.name]: event.target.value });
  }

  function handleLocationChange(newLocation: string): void {
    setState({ ...state, location: false });
    setInput({ ...input, location: newLocation });
  }

  function handleStartDateChange(newStartDate: Dayjs | null): void {
    setState({ ...state, date: false });
    setInput({ ...input, startDate: newStartDate });
  }

  function handleEndDateChange(newEndDate: Dayjs | null): void {
    setState({ ...state, date: false });
    setInput({ ...input, endDate: newEndDate });
  }

  function handleTagsChange(newTags: Tag[]): void {
    setState({ ...state, tags: false });
    setInput({ ...input, tags: newTags });
  }

  function handleImagesChange(newImages: string[]): void {
    setState({ ...state, images: false });
    setInput({ ...input, images: newImages });
  }

  const handleSubmit = async () => {
    setState({
      title: true,
      location: true,
      date: true,
      tags: true,
      description: true,
      images: true,
    });

    const isCreatingAllow: boolean = !(
      titleError.err ||
      locationError ||
      startDateError.err ||
      endDateError.err ||
      tagsError ||
      descriptionError.err ||
      imagesError
    );
    if (isCreatingAllow) {
      if (!userStatus.user?.userId || !input.startDate || !input.endDate) return;
      const newPost: PostInfo = {
        title: input.title,
        userId: userStatus.user?.userId,
        location: input.location,
        tags: input.tags,
        description: input.description,
        images: input.images,
        startTime: input.startDate,
        endTime: input.endDate,
      };
      CreatePost(newPost, supabaseClient)
        .then(() => {
          router.push(PAGE_PATHS.MY_POSTS);
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    }
  };

  useEffect(() => {
    GetAllTags(supabaseClient)
      .then((allTags) => setTagMenu(allTags))
      .catch((err) => console.log(err));
  }, [supabaseClient]);

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
  if (userStatus.isLoading || tagMenu.length == 0) return <Loading />;
  return (
    <>
      <Navbar />
      <Stack spacing={4} alignItems="center">
        {/* Page header */}
        <Box sx={{ marginTop: "4vh" }}>
          <Typography variant="h1">Create post</Typography>
        </Box>

        <Stack spacing={5} direction="row">
          <Card sx={CreatePostStyle.Card}>
            <Stack spacing={0} alignItems="center" justifyContent="center">
              {/* Post title */}
              <Box style={CreatePostStyle.TextField}>
                <NormalTextField
                  name="title"
                  header="Title"
                  icon={ICONS.EDIT}
                  placeholder="This is Post Title"
                  value={input.title}
                  handleValueChange={handleTextFieldChange}
                  char_limit={100}
                  isErr={state.title && titleError.err}
                  errMsg={titleError.msg}
                />
              </Box>

              {/* Location */}
              <Box sx={CreatePostStyle.TextField}>
                <LocationTextField
                  header="Location"
                  placeholder="Enter Location"
                  onChange={handleLocationChange}
                  isErr={state.location && locationError}
                  errMsg="ช่องนี้ไม่สามารถเว้นว่างได้"
                />
              </Box>

              {/* Start date */}
              <Box sx={CreatePostStyle.TextField}>
                <Typography variant="body1">Date time</Typography>
                <CommonDateTimePicker
                  header="Start"
                  placeHolder="e.g. 28/ 02 / 2023 11.00 AM or click on the icon"
                  value={input.startDate}
                  handleValueChange={handleStartDateChange}
                  isErr={state.date && startDateError.err}
                  errMsg={startDateError.msg}
                />
              </Box>

              {/* End date */}
              <Box sx={CreatePostStyle.TextField}>
                <CommonDateTimePicker
                  header="End"
                  placeHolder="e.g. 28 / 02 / 2023 01.00 PM or click on the icon"
                  value={input.endDate}
                  handleValueChange={handleEndDateChange}
                  isErr={state.date && endDateError.err}
                  errMsg={endDateError.msg}
                />
              </Box>

              {/* Tags */}
              <Box sx={CreatePostStyle.TextField}>
                <Tags
                  header="Tag"
                  note="(เลือกได้สูงสุด 5 Tags)"
                  value={input.tags}
                  handleValueChange={handleTagsChange}
                  menuValue={tagMenu}
                  isErr={state.tags && tagsError}
                  errMsg="กรุณาใส่อย่างน้อย 1 tag"
                />
              </Box>
            </Stack>
          </Card>
          <Card sx={CreatePostStyle.Card}>
            <Stack spacing={0} alignItems="center" justifyContent="center">
              {/* Description */}
              <Box sx={CreatePostStyle.TextField}>
                <DescriptionTextField
                  name="description"
                  header="Description"
                  placeholder="Enter Description Here"
                  value={input.description}
                  handleValueChange={handleTextFieldChange}
                  char_limit={CHAR_LIMIT.MAX_DESCRIPTION}
                  isErr={state.description && descriptionError.err}
                  errMsg={descriptionError.msg}
                />
              </Box>

              {/* Image list */}
              <Box sx={CreatePostStyle.TextField}>
                <PictureList
                  header="Image"
                  note="(Optional, เลือกได้สูงสุด 3 รูป)"
                  imgs={input.images}
                  stateChanger={handleImagesChange}
                  // st={setImgErrState}
                  isErr={true}
                  errMsg="เลือกรูปภาพได้ไม่เกิน 3 รูป"
                />
              </Box>
            </Stack>
          </Card>
        </Stack>

        {/* Create post button */}
        <Button variant="contained" onClick={handleSubmit}>
          Create Post
        </Button>
      </Stack>
    </>
  );
}
