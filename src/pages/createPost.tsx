import { useEffect, useState, useContext, ChangeEvent } from "react";
import { Dayjs } from "dayjs";
import { useRouter } from "next/router";

import { userContext } from "supabase/user_context";
import { Typography, Stack, Box, Card, IconButton } from "@mui/material";

import Loading from "@/components/public/Loading";
import Navbar from "@/components/public/Navbar";
import CommonDateTimePicker from "@/components/post/CommonDateTimePicker";
import Tags from "@/components/post/SelectTags";
import PictureList from "@/components/post/SelectImages";
import { validateDate, validateDateWithInterval, validateTextField } from "@/utilities/validation";

import { validation } from "@/types/Validation";
import { Tag } from "@/types/Tag";
import { PAGE_PATHS } from "enum/PAGES";
import { CHAR_LIMIT } from "enum/INPUT_LIMIT";

import { Service } from "@/services";
import { PostInfo } from "@/types/Post";
import DescriptionTextField from "@/components/public/DescriptionTextField";
import LocationTextField from "@/components/post/LocationTextField";
import CommonButton from "@/components/public/CommonButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TitleTextField from "@/components/post/TitleTextField";

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
    minWidth: "400px",
  },
  Card: {
    width: "30vw",
    minWidth: "450px",
    height: "70vh",
    minHeight: "710px",
    paddingTop: "2vh",
  },
};

export default function Home() {
  const service = new Service();
  const router = useRouter();
  const userStatus = useContext(userContext);

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
      service.post
        .CreatePost(newPost)
        .then(() => {
          router.push(PAGE_PATHS.MY_POSTS);
          return;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    }
  };

  function backToMyPost(): void {
    router.push(PAGE_PATHS.MY_POSTS);
    return;
  }

  useEffect(() => {
    service.tag
      .GetAllTags()
      .then((allTags) => setTagMenu(allTags))
      .catch((err) => console.log(err));
  }, []);

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

      <IconButton
        onClick={backToMyPost}
        style={{ position: "absolute", top: 86, left: 20, zIndex: "1" }}
      >
        <ArrowBackIcon fontSize="large" color="secondary" />
      </IconButton>

      <Stack spacing={4} sx={{ marginBottom: "2vh" }} alignItems="center">
        {/* Page header */}
        <Box sx={{ marginTop: "3vh" }}>
          <Typography variant="h1">Create post</Typography>
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
                  value={input.title}
                  handleValueChange={handleTextFieldChange}
                  char_limit={CHAR_LIMIT.MAX_TITLE}
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
                  errMsg="This field cannot be blank."
                />
              </Box>

              {/* Start date */}
              <Box sx={CreatePostStyle.TextField}>
                <Typography variant="h3">Date & Time</Typography>
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
                  note="(Maximum 5 Tags)"
                  value={input.tags}
                  handleValueChange={handleTagsChange}
                  menuValue={tagMenu}
                  isErr={state.tags && tagsError}
                  errMsg="You must insert at least 1 tag."
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
                  height={8}
                />
              </Box>

              {/* Image list */}
              <Box sx={CreatePostStyle.TextField}>
                <PictureList
                  header="Image"
                  note="(Optional, Maximum 6 Images)"
                  imgs={input.images}
                  stateChanger={handleImagesChange}
                  // st={setImgErrState}
                  isErr={true}
                  errMsg="Cannot upload more than 6 images."
                />
              </Box>
            </Stack>
          </Card>
        </Stack>

        {/* Create post button */}
        <CommonButton label="Create Post" onClick={handleSubmit} />
      </Stack>
    </>
  );
}
