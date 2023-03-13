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
import Tags from "@/components/createPost/Tags";
import GoogleMap from "@/components/createPost/searchMaps";
import PictureList from "@/components/createPost/pictureList";

import { Tag } from "@/types/Tag";
import { PagePaths } from "enum/pages";
import { CHAR_LIMIT } from "enum/inputLimit";

import { validateDate, validateDateWithInterval, validateTextField } from "@/utilities/validation";
import { validation } from "@/types/Validation";
import { GetAllTags } from "@/services/Tags";
import { CreatePost } from "@/services/Posts";
import { PostInfo } from "@/types/Post";

//style
const createPostLayout = {
  width: "35vw",
  minWidth: "300px",
  margin: "2vh 0 0 0",
};

export default function Home() {
  const router = useRouter();
  const userStatus = useContext(userContext);
  const supabaseClient = useSupabaseClient<Database>();

  // input variables
  const [title, setTitle] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [description, setDescription] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);

  // all selectable tags offered
  const [tagMenu, setTagMenu] = useState<Tag[]>([]);

  // submit variables
  const [isSubmitTitle, setIsSubmitTitle] = useState<boolean>(false);
  const [isSubmitLocation, setIsSubmitLocation] = useState<boolean>(false);
  const [isSubmitDate, setIsSubmitDate] = useState<boolean>(false);
  const [isSubmitTags, setIsSubmitTags] = useState<boolean>(false);
  const [isSubmitDescription, setIsSubmitDescription] = useState<boolean>(false);
  const [isSubmitImages, setIsSubmitImages] = useState<boolean>(false);

  // error variables
  const titleError: validation = validateTextField(
    title,
    CHAR_LIMIT.MIN_TITLE,
    CHAR_LIMIT.MAX_TITLE
  );
  const locationError: boolean = location.trim() === "";
  const startDateError: validation = validateDate(startDate);
  const endDateError: validation = validateDateWithInterval(startDate, endDate);
  const tagsError: boolean = tags.length === 0;
  const descriptionError: validation = validateTextField(
    description,
    CHAR_LIMIT.MIN_DESCRIPTION,
    CHAR_LIMIT.MAX_DESCRIPTION
  );
  const imagesError: boolean = false;

  const isCreatingAllow: boolean = !(
    titleError.err ||
    locationError ||
    startDateError.err ||
    endDateError.err ||
    tagsError ||
    descriptionError.err ||
    imagesError
  );

  // input field change
  function handleTitleChange(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
    setTitle(event.target.value);
    setIsSubmitTitle(false);
  }

  function handleLocationChange(newLocation: string): void {
    setLocation(newLocation);
    setIsSubmitLocation(false);
  }

  function handleStartDateChange(newStartDate: Dayjs | null): void {
    setStartDate(newStartDate);
    setIsSubmitDate(false);
  }

  function handleEndDateChange(newEndDate: Dayjs | null): void {
    setEndDate(newEndDate);
    setIsSubmitDate(false);
  }

  function handleTagsChange(newTags: Tag[]): void {
    setTags(newTags);
    setIsSubmitTags(false);
  }

  function handleDescriptionChange(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    setDescription(event.target.value);
    setIsSubmitDescription(false);
  }

  function handleImagesChange(newImages: string[]): void {
    setImages(newImages);
    setIsSubmitImages(false);
  }

  const handleSubmit = async () => {
    // set submission
    setIsSubmitTitle(true);
    setIsSubmitLocation(true);
    setIsSubmitDate(true);
    setIsSubmitTags(true);
    setIsSubmitDescription(true);
    setIsSubmitImages(true);
    if (isCreatingAllow) {
      if (!userStatus.user?.userId || !startDate || !endDate) return;
      const newPost: PostInfo = {
        title: title,
        userId: userStatus.user?.userId,
        location: location,
        tags: tags,
        description: description,
        images: images,
        startTime: startDate,
        endTime: endDate,
        participants: [],
      };
      CreatePost(newPost, supabaseClient)
        .then(() => {
          router.push(PagePaths.myPosts);
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
    router.push(PagePaths.login);
    return;
  }
  if (userStatus.user.isAdmin) {
    router.push(PagePaths.adminHome + userStatus.user.userId);
    return;
  }
  if (!userStatus.user.isVerified) {
    router.push(PagePaths.home)
    return;
  }
  if (userStatus.isLoading || tagMenu.length == 0) return <Loading />;
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
        <Box sx={createPostLayout}>
          <Typography variant="h1">Create post</Typography>
        </Box>

        {/* Post title */}
        <Box sx={createPostLayout}>
          <CommonTextField
            header="Title"
            placeholder="เช่น หาเพื่อนไปเที่ยวบอร์ดเกม"
            value={title}
            handleValueChange={handleTitleChange}
            char_limit={CHAR_LIMIT.MAX_TITLE}
            isErr={isSubmitTitle && titleError.err}
            errMsg={titleError.msg}
          />
        </Box>

        {/* Location */}
        <Box sx={createPostLayout}>
          <Typography variant="body1">Location</Typography>
          <Stack spacing={2}>
            <GoogleMap onChange={handleLocationChange} />
            {isSubmitLocation && locationError && (
              <FormHelperText error>ช่องนี้ไม่สามารถเว้นว่างได้</FormHelperText>
            )}
          </Stack>
        </Box>

        {/* Date time */}
        <Box sx={createPostLayout}>
          <Typography variant="body1">Date time</Typography>
          <Grid container columnSpacing={2}>
            {/* Start date */}
            <Grid item xs={6}>
              <CommonDateTimePicker
                header="Start"
                placeHolder="xx / xx / xxxx xx.xx xx"
                value={startDate}
                handleValueChange={handleStartDateChange}
                isErr={isSubmitDate && startDateError.err}
                errMsg={startDateError.msg}
              />
            </Grid>

            {/* End date */}
            <Grid item xs={6}>
              <CommonDateTimePicker
                header="End"
                placeHolder="xx / xx / xxxx xx.xx xx"
                value={endDate}
                handleValueChange={handleEndDateChange}
                isErr={isSubmitDate && endDateError.err}
                errMsg={endDateError.msg}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Tags */}
        <Box sx={createPostLayout}>
          <Tags
            header="Tag"
            note="(เลือกได้สูงสุด 5 Tags)"
            value={tags}
            handleValueChange={handleTagsChange}
            menuValue={tagMenu}
            isErr={isSubmitTags && tagsError}
            errMsg="กรุณาใส่อย่างน้อย 1 tag"
          />
        </Box>

        {/* Description */}
        <Box sx={createPostLayout}>
          <CommonTextField
            header="Description"
            placeholder="เช่น มาเที่ยวกันเลย ร้านบอร์ดเกมแถวรัชดา"
            value={description}
            handleValueChange={handleDescriptionChange}
            char_limit={CHAR_LIMIT.MAX_DESCRIPTION}
            isMultiLine={true}
            isErr={isSubmitDescription && descriptionError.err}
            errMsg={descriptionError.msg}
          />
        </Box>

        {/* Image list */}
        <Box sx={createPostLayout}>
          <PictureList
            header="Image"
            note="(Optional, เลือกได้สูงสุด 3 รูป)"
            imgs={images}
            stateChanger={handleImagesChange}
            // st={setImgErrState}
            isErr={true}
            errMsg="เลือกรูปภาพได้ไม่เกิน 3 รูป"
          />
        </Box>

        {/* Create post button */}
        <Button variant="contained" onClick={handleSubmit}>
          Create Post
        </Button>
      </Stack>
    </>
  );
}
