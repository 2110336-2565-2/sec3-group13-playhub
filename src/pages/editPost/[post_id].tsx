import { useEffect, useState, useContext, ChangeEvent } from "react";
import { Dayjs } from "dayjs";
import { useRouter } from "next/router";

import { userContext } from "supabase/user_context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { Typography, Stack, Box, Card, IconButton } from "@mui/material";

import Loading from "@/components/public/Loading";
import Navbar from "@/components/public/Navbar";
import CommonDateTimePicker from "@/components/post/CommonDateTimePicker";
import Tags from "@/components/post/SelectTags";
import LocationTextField from "@/components/post/LocationTextField";
import PictureList from "@/components/post/SelectImages";
import { validateDate, validateDateWithInterval, validateTextField } from "@/utilities/validation";

import { Tag } from "@/types/Tag";
import { PostInfo } from "@/types/Post";
import { validation } from "@/types/Validation";
import { PAGE_PATHS } from "enum/PAGES";
import { CHAR_LIMIT } from "enum/INPUT_LIMIT";

import { GetAllTags } from "@/services/Tags";
import { GetPostByPostId, UpdatePost } from "@/services/Posts";
import { ICONS } from "enum/ICONS";
import DescriptionTextField from "@/components/public/DescriptionTextField";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CommonButton from "@/components/public/CommonButton";
import TitleTextField from "@/components/post/TitleTextField";
import CommonDialog from "@/components/public/CommonDialog";
import { COLOR } from "enum/COLOR";

type EditPostInput = {
  title: string;
  location: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  tags: Tag[];
  description: string;
  images: string[];
};

type EditPostSubmit = {
  title: boolean;
  location: boolean;
  date: boolean;
  tags: boolean;
  description: boolean;
  images: boolean;
};

const EditPostStyle = {
  TextField: {
    width: "28vw",
    minWidth: "250px",
  },
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

  const [input, setInput] = useState<EditPostInput>({
    title: "",
    location: "",
    startDate: null,
    endDate: null,
    tags: [],
    description: "",
    images: [],
  });
  const [state, setState] = useState<EditPostSubmit>({
    title: false,
    location: false,
    date: false,
    tags: false,
    description: false,
    images: false,
  });

  const [originalImages, setOriginalImages] = useState<string[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  const [tagMenu, setTagMenu] = useState<Tag[]>([]);
  const [isVerifyModalShow, setIsVerifyModalShow] = useState<boolean>(false);

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
    if (!userStatus.user || !input.startDate || !input.endDate) return;
    setState({
      title: true,
      location: true,
      date: true,
      tags: true,
      description: true,
      images: true,
    });

    const isEditingAllow: boolean = !(
      titleError.err ||
      locationError ||
      startDateError.err ||
      endDateError.err ||
      tagsError ||
      descriptionError.err ||
      imagesError
    );
    if (isEditingAllow) {
      const updatedPost: PostInfo = {
        title: input.title,
        userId: userStatus.user.userId,
        location: input.location,
        tags: input.tags,
        description: input.description,
        images: input.images,
        startTime: input.startDate,
        endTime: input.endDate,
      };
      UpdatePost(parseInt(router.query.post_id as string), originalImages, updatedPost, supabaseClient)
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

  function handleOpenModal(): void {
    setIsVerifyModalShow(true);
  }

  function handleCloseModal(): void {
    setIsVerifyModalShow(false);
  }

  useEffect(() => {
    GetAllTags(supabaseClient)
      .then((allTags) => setTagMenu(allTags))
      .catch((err) => console.log(err));
  }, [supabaseClient]);

  useEffect(() => {
    if (!parseInt(router.query.post_id as string) || !userStatus.user) return;
    GetPostByPostId(userStatus.user, parseInt(router.query.post_id as string), supabaseClient)
      .then((p) => {
        setInput({
          title: p.title,
          location: p.location,
          startDate: p.startTime,
          endDate: p.endTime,
          tags: p.tags,
          description: p.description,
          images: p.images,
        });
        setOriginalImages(p.images);
        setLoadingData(false);
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  }, [supabaseClient, router.query.post_id, userStatus.user]);

  if (!userStatus.user) {
    router.push(PAGE_PATHS.LOGIN);
    return;
  }
  if (!userStatus.user.isVerified) {
    router.push(PAGE_PATHS.HOME);
    return;
  }
  if (tagMenu.length == 0 || userStatus.isLoading || loadingData) return <Loading />;
  return (
    <>
      <Navbar />

      <IconButton
        onClick={handleOpenModal}
        style={{ position: "absolute", top: 86, left: 20, zIndex: "1" }}
      >
        <ArrowBackIcon fontSize="large" color="secondary" />
      </IconButton>

      <Stack spacing={4} sx={{ marginBottom: "2vh", }} alignItems="center">
        {/* Page header */}
        <Box sx={{ marginTop: "3vh" }}>
          <Typography variant="h1">Edit post</Typography>
        </Box>

        <Stack spacing={5} direction="row">
          <Card sx={EditPostStyle.Card}>
            <Stack spacing={0} alignItems="center" justifyContent="center">
              {/* Post title */}
              <Box style={EditPostStyle.TextField}>
                <TitleTextField
                  name="title"
                  header="Title"
                  icon={ICONS.EDIT}
                  placeholder="This is Post Title"
                  value={input.title}
                  handleValueChange={handleTextFieldChange}
                  char_limit={CHAR_LIMIT.MAX_TITLE}
                  isErr={state.title && titleError.err}
                  errMsg={titleError.msg}
                />
              </Box>

              {/* Location */}
              <Box sx={EditPostStyle.TextField}>
                <LocationTextField
                  header="Location"
                  placeholder="Enter Location"
                  initialValue={input.location}
                  onChange={handleLocationChange}
                  isErr={state.location && locationError}
                  errMsg="ช่องนี้ไม่สามารถเว้นว่างได้"
                />
              </Box>

              {/* Start date */}
              <Box sx={EditPostStyle.TextField}>
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
              <Box sx={EditPostStyle.TextField}>
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
              <Box sx={EditPostStyle.TextField}>
                <Tags
                  header="Tag"
                  note="(Maximum 5 Tags)"
                  value={input.tags}
                  handleValueChange={handleTagsChange}
                  menuValue={tagMenu}
                  isErr={state.tags && tagsError}
                  errMsg="กรุณาใส่อย่างน้อย 1 tag"
                />
              </Box>
            </Stack>
          </Card>
          <Card sx={EditPostStyle.Card}>
            <Stack spacing={0} alignItems="center" justifyContent="center">
              {/* Description */}
              <Box sx={EditPostStyle.TextField}>
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
              <Box sx={EditPostStyle.TextField}>
                <PictureList
                  header="Image"
                  note="(Optional, Maximum 6 Images)"
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

        {/* Edit post button */}
        <CommonButton label="Save" onClick={handleSubmit} />
      </Stack>

      <CommonDialog
        openModal={isVerifyModalShow}
        handleCloseModal={handleCloseModal}
        header={["Are you sure to", "quit", "edit post ?"]}
        content="*All changes would be discarded"
        buttonLabel="Quit"
        buttonColor={COLOR.PRIMARY}
        buttonAction={backToMyPost}
      />
    </>
  );
}
