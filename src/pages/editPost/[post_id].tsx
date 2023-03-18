import { useEffect, useState, useContext, ChangeEvent } from "react";
import { Dayjs } from "dayjs";
import { useRouter } from "next/router";

import { userContext } from "supabase/user_context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { Grid, Typography, Button, FormHelperText, Stack, Box } from "@mui/material";

import Loading from "@/components/public/Loading";
import Navbar from "@/components/public/Navbar";
import CommonTextField from "@/components/public/CommonTextField";
import CommonDateTimePicker from "@/components/public/CommonDateTimePicker";
import Tags from "@/components/post/SelectTags";
import GoogleMap from "@/components/createPost/searchMaps";
import PictureList from "@/components/post/ImageList";
import { validateDate, validateDateWithInterval, validateTextField } from "@/utilities/validation";

import { Tag } from "@/types/Tag";
import { PostInfo } from "@/types/Post";
import { validation } from "@/types/Validation";
import { PAGE_PATHS } from "enum/PAGES";
import { CHAR_LIMIT } from "enum/INPUT_LIMIT";

import { GetAllTags } from "@/services/Tags";
import { GetPostByPostId, UpdatePost } from "@/services/Posts";

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
    width: "35vw",
    minWidth: "300px",
    margin: "2vh 0 0 0",
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

  const postId = parseInt(router.query.post_id as string);

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
      UpdatePost(postId, originalImages, updatedPost, supabaseClient)
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

  useEffect(() => {
    async function getPostData() {
      if (!postId || !userStatus.user) return;
      GetPostByPostId(userStatus.user, postId, supabaseClient)
        .then((p) => {
          setInput({
            title: p.title,
            location: p.description,
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
    }
    getPostData();
  }, [supabaseClient, router.query.post_id]);

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
      <Stack
        spacing={2}
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
        margin="0 0 2vh 0"
      >
        {/* Page header */}
        <Box sx={EditPostStyle.TextField}>
          <Typography variant="h1">Edit post</Typography>
        </Box>

        {/* Post title */}
        <Box sx={EditPostStyle.TextField}>
          <CommonTextField
            header="Title"
            placeholder="เช่น หาเพื่อนไปเที่ยวบอร์ดเกม"
            value={input.title}
            handleValueChange={handleTextFieldChange}
            char_limit={CHAR_LIMIT.MAX_TITLE}
            isErr={state.title && titleError.err}
            errMsg={titleError.msg}
          />
        </Box>

        {/* Location */}
        <Box sx={EditPostStyle.TextField}>
          <Typography variant="body1">Location</Typography>
          <Stack spacing={2}>
            <GoogleMap onChange={handleLocationChange} initialValue={input.location} />
            {state.location && locationError && (
              <FormHelperText error>ช่องนี้ไม่สามารถเว้นว่างได้</FormHelperText>
            )}
          </Stack>
        </Box>

        {/* Date time */}
        <Box sx={EditPostStyle.TextField}>
          <Typography variant="body1">Date time</Typography>
          <Grid container columnSpacing={2}>
            {/* Start date */}
            <Grid item xs={6}>
              <CommonDateTimePicker
                header="Start"
                placeHolder="xx / xx / xxxx xx.xx xx"
                value={input.startDate}
                handleValueChange={handleStartDateChange}
                isErr={state.date && startDateError.err}
                errMsg={startDateError.msg}
              />
            </Grid>

            {/* End date */}
            <Grid item xs={6}>
              <CommonDateTimePicker
                header="End"
                placeHolder="xx / xx / xxxx xx.xx xx"
                value={input.endDate}
                handleValueChange={handleEndDateChange}
                isErr={state.date && endDateError.err}
                errMsg={endDateError.msg}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Tags */}
        <Box sx={EditPostStyle.TextField}>
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

        {/* Description */}
        <Box sx={EditPostStyle.TextField}>
          <CommonTextField
            header="Description"
            placeholder="เช่น มาเที่ยวกันเลย ร้านบอร์ดเกมแถวรัชดา"
            value={input.description}
            handleValueChange={handleTextFieldChange}
            char_limit={CHAR_LIMIT.MAX_DESCRIPTION}
            isMultiLine={true}
            isErr={state.description && descriptionError.err}
            errMsg={descriptionError.msg}
          />
        </Box>

        {/* Image list */}
        <Box sx={EditPostStyle.TextField}>
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

        {/* Create post button */}
        <Button variant="contained" onClick={handleSubmit}>
          Update Post
        </Button>
      </Stack>
    </>
  );
}
