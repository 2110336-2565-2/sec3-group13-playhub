import { useEffect, useState, useContext, ChangeEvent } from "react";
import dayjs, { Dayjs } from "dayjs";

import { NextRouter, useRouter } from "next/router";

import { userContext } from "supabase/user_context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";

import {
  Grid,
  Typography,
  Button,
  FormHelperText,
  Stack,
  Box,
} from "@mui/material";

import Loading from "@/components/public/Loading";
import Navbar from "@/components/public/Navbar";
import CommonTextField from "@/components/public/CommonTextField";
import CommonDateTimePicker from "@/components/public/CommonDateTimePicker";
import Tags from "@/components/createPost/Tags";
import GoogleMap from "@/components/createPost/searchMaps";
import PictureList from "@/components/createPost/PictureList";

import { Tag } from "@/types/Tag";
import { PagePaths } from "enum/pages";
import { CHAR_LIMIT } from "enum/inputLimit";

import {
  validateDate,
  validateDateWithInterval,
  validateTextField,
} from "@/utilities/validation";
import { validation } from "@/types/Validation";

//style
const editPostLayout = {
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
  const [originalImages, setOriginalImages] = useState<string[]>([]);

  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const [loadingTag, setLoadingTag] = useState<boolean>(true);

  // all selectable tags offered
  const [tagMenu, setTagMenu] = useState<Tag[]>([]);

  // submit variables
  const [isSubmitTitle, setIsSubmitTitle] = useState<boolean>(false);
  const [isSubmitLocation, setIsSubmitLocation] = useState<boolean>(false);
  const [isSubmitDate, setIsSubmitDate] = useState<boolean>(false);
  const [isSubmitTags, setIsSubmitTags] = useState<boolean>(false);
  const [isSubmitDescription, setIsSubmitDescription] =
    useState<boolean>(false);
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

  const isEditingAllow: boolean = !(
    titleError.err ||
    locationError ||
    startDateError.err ||
    endDateError.err ||
    tagsError ||
    descriptionError.err ||
    imagesError
  );

  // input field change
  function handleTitleChange(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
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
    if (isEditingAllow) {
      const sendData = {
        post_id: postId,
        post_title: title,
        post_location: location,
        post_start_time: startDate,
        post_end_time: endDate,
        post_description: description,
      };

      const updatePostResult = await supabaseClient.rpc(
        "update_post_by_post_id",
        sendData
      );
      if (updatePostResult.error) {
        console.log(updatePostResult.error);
        return;
      }

      // const deleteOldTagResult = await supabaseClient.rpc("delete_post_tag", {
      //   target_post_id: postId,
      // });

      tags.forEach(async (e) => {
        await supabaseClient.rpc("add_post_tag", {
          tag_id: e.id,
          post_id: postId,
        });
      });

      let index = 0;
      for (const image of originalImages) {
        if (!images.includes(image)) {
          const deleteImage = image.split("/").at(-1) as string;
          const deleteImageResult = await supabaseClient.storage
            .from("locationimage")
            .remove([deleteImage]);
          if (deleteImageResult.error != null) {
            console.log(deleteImageResult.error);
            return;
          }

          const deleteImageFromTableResult = await supabaseClient.rpc(
            "delete_image_by_link",
            { target_image_link: image }
          );
          if (deleteImageFromTableResult.error) {
            console.log(deleteImageFromTableResult.error);
            return;
          }
        }
        index += 1;
      }

      index = 0;
      for (const image of images) {
        const timeStamp = Date.now();

        if (!originalImages.includes(image)) {
          const uploadImageFile = await fetch(image).then((r) => r.blob());
          const uploadImageResult = await supabaseClient.storage
            .from("locationimage")
            .upload(postId.toString() + index + timeStamp, uploadImageFile);
          if (uploadImageResult.error != null) {
            console.log(uploadImageResult.error);
            return;
          }

          const getImageURLResult = await supabaseClient.storage
            .from("locationimage")
            .getPublicUrl(postId.toString() + index + timeStamp);

          const addImageToTable = await supabaseClient.rpc(
            "add_location_image",
            {
              target_post_id: postId,
              target_image_link: getImageURLResult.data.publicUrl,
            }
          );
        }
      }

      router.push(PagePaths.myPosts);
    }
  };

  const postId = parseInt(router.query.post_id as string);

  useEffect(() => {
    async function getAllTags() {
      const getTagsResult = await supabaseClient.rpc("get_all_possible_tags");
      if (getTagsResult.error) {
        console.log(getTagsResult.error);
        return;
      }
      setTagMenu(getTagsResult.data);
    }

    getAllTags();
  }, [supabaseClient]);

  useEffect(() => {
    async function getSelectedTag() {
      const getSelectedTagResult = await supabaseClient.rpc("get_all_post_tag");
      if (getSelectedTagResult.error) {
        console.log(getSelectedTagResult.error);
        return;
      }

      const userPostTags = getSelectedTagResult.data.filter(
        (data) => data.post_id == postId
      );

      setTags(userPostTags);
      setLoadingTag(false);
    }

    getSelectedTag();
  }, [supabaseClient, router.query.post_id]);

  useEffect(() => {
    async function getPostData() {
      if (!router.query.post_id) return;

      const getPostDataResult = await supabaseClient.rpc(
        "get_post_data_by_post_id",
        {
          target_id: postId,
        }
      );
      if (getPostDataResult.error) {
        console.log(getPostDataResult.error);
        return;
      }

      if (!getPostDataResult.data) return;

      setTitle(getPostDataResult.data[0].title);
      setDescription(getPostDataResult.data[0].description);
      setLocation(getPostDataResult.data[0].location);
      setStartDate(dayjs(getPostDataResult.data[0].start_timestamp));
      setEndDate(dayjs(getPostDataResult.data[0].end_timestamp));
      setLoadingData(false);
    }

    getPostData();
  }, [supabaseClient, router.query.post_id]);

  useEffect(() => {
    async function getPostLocationImage() {
      const getPostLocationImageResult = await supabaseClient.rpc(
        "get_post_location_image",
        { target_post_id: postId }
      );
      if (getPostLocationImageResult.error) {
        console.log(getPostLocationImageResult.error);
        return;
      }

      const locationImage = getPostLocationImageResult.data.map((e) => e.image);
      setImages(locationImage);
      setOriginalImages(locationImage);
      setLoadingImage(false);
    }

    getPostLocationImage();
  }, [supabaseClient, router.query.post_id]);

  if (
    tagMenu.length == 0 ||
    userStatus.isLoading ||
    loadingTag ||
    loadingData ||
    loadingImage
  )
    return <Loading />;
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
        <Box sx={editPostLayout}>
          <Typography variant="h1">Edit post</Typography>
        </Box>

        {/* Post title */}
        <Box sx={editPostLayout}>
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
        <Box sx={editPostLayout}>
          <Typography variant="body1">Location</Typography>
          <Stack spacing={2}>
            <GoogleMap onChange={handleLocationChange} />
            {isSubmitLocation && locationError && (
              <FormHelperText error>ช่องนี้ไม่สามารถเว้นว่างได้</FormHelperText>
            )}
          </Stack>
        </Box>

        {/* Date time */}
        <Box sx={editPostLayout}>
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
        <Box sx={editPostLayout}>
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
        <Box sx={editPostLayout}>
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
        <Box sx={editPostLayout}>
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
          Update Post
        </Button>
      </Stack>
    </>
  );
}
