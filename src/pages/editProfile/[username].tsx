import { useState, useEffect, useContext } from "react";
import Navbar from "@/components/public/Navbar";
import {
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Button,
  SelectChangeEvent,
  Avatar,
  Stack,
  Box,
  Link,
  IconButton,
} from "@mui/material";

import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { editProfileHeader } from "public/locales/editProfileHeader";
import { Gender } from "enum/gender";
import { CHAR_LIMIT } from "enum/inputLimit";

import { User } from "@/types/User";

import Image from "next/image";

import { PagePaths } from "enum/pages";
import { validateImage, validateTextField } from "@/utilities/validation";
import { NextRouter, useRouter } from "next/router";
import React from "react";
import { SessionContext, useSessionContext } from "@supabase/auth-helpers-react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { userContext } from "supabase/user_context";
import { randomInt } from "crypto";
import { validation } from "@/types/Validation";
import InputTextBox from "@/components/public/InputTextBox";

export default function Home() {
  const supabaseClient = useSupabaseClient<Database>();
  const userStatus = useContext(userContext);

  const avatar = { width: 200, height: 200 };
  const overlayIcon = {
    position: "absolute",
    color: "black",
    opacity: "0.5",
  };
  const editInfoContainer = {
    width: "50vw",
    margin: "3vh 0 0 0",
  };
  const helperText = {
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  };

  const router: NextRouter = useRouter();
  const sessionContext: SessionContext = useSessionContext();
  const controller = new AbortController();

  const [userData, setUserData] = React.useState<User | null>(null);
  const [displayName, setDisplayName] = React.useState<string>("");
  const [gender, setGender] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [image, setImage] = React.useState<string>("");

  const [isPressSubmit, setIsPressSubmit] = React.useState<boolean>(false);
  const [fileImage, setFileImage] = React.useState<File>();
  const [isImageUpload, setIsImageUpload] = React.useState<boolean>(true);
  const [showImageUploadError, setShowImageUploadError] = useState({
    msg: "",
    err: false,
  });

  const displayNameErr: validation = validateTextField(
    displayName,
    1,
    CHAR_LIMIT.DISPLAY_NAME_LIMIT
  );
  const descriptionErr: validation = validateTextField(
    description,
    0,
    CHAR_LIMIT.DESCRIPTION_LIMIT
  );

  const getProfile = async (User: User) => {
    setDisplayName(User.name);
    setDescription(User.description);
    setGender(User.sex);
    setImage(User.image);
  };

  const editProfileBtnOnClick = async () => {
    if (userStatus.user == null) return;
    setIsPressSubmit(true);
    const readyToSubmit: boolean = !(displayNameErr.err || descriptionErr.err || !isImageUpload);
    if (readyToSubmit && fileImage !== undefined) {
      //send to API

      const uploadImageResult = await supabaseClient.storage
        .from("profileimage")
        .update("profileImage_" + userStatus.user.user_id, fileImage);
      if (uploadImageResult.error != null) {
        console.log(uploadImageResult.error);
        return;
      }

      const getImageURLResult = await supabaseClient.storage
        .from("profileimage")
        .getPublicUrl("profileImage_" + userStatus.user.user_id);

      const sendData = {
        name: displayName,
        sex: gender,
        description: description,
        image: getImageURLResult.data.publicUrl,
      };
      const updateResult = await supabaseClient
        .from("User")
        .update(sendData)
        .eq("user_id", userStatus.user.user_id);

      if (updateResult.error) {
        console.log(updateResult.error);
        return;
      }
      console.log("Edit success");
      router.push(PagePaths.profile + "/" + userStatus.user.username);
    } else {
      console.log("Something went wrong");
    }
  };

  React.useEffect(() => {
    async function getUserData() {
      if (!router.query.username || !sessionContext.session || userData) return;
      const fetchResult = await supabaseClient
        .from("User")
        .select("username,name,sex,birthdate,description,image,email, user_id")
        .eq("username", router.query.username);
      if (fetchResult.error) {
        // having query error
        console.log(fetchResult.error);
        return;
      }
      if (fetchResult.count == 0) {
        // no data etry with matching username
        console.log("cant find the user");
        router.push(PagePaths.login);
        return;
      }
      setUserData(fetchResult.data[0]);
    }

    getUserData();
    if (userData) {
      getProfile(userData);
    }
    return () => controller.abort();
  }, [router, sessionContext, userData]);

  const handleImageChange = (event: any): void => {
    const tempFile = event.target.files[0];
    setImage(URL.createObjectURL(tempFile));
    const imgErrMsg = validateImage(tempFile.type, tempFile.size);
    setShowImageUploadError(imgErrMsg);
    if (imgErrMsg.err) {
      setIsImageUpload(false);
    } else {
      setFileImage(event.target.files[0]);
      setIsImageUpload(true);
    }
  };

  const handleDisplayNameChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setDisplayName(event.target.value);
    setIsPressSubmit(false);
  };
  const handleDescChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setDescription(event.target.value);
    setIsPressSubmit(false);
  };
  const handleSelectChange = (event: SelectChangeEvent): void => {
    setGender(event.target.value as string);
  };

  function handleGoBack(): void {
    router.back();
    return;
  }

  return (
    <>
      <Navbar />
      <Link onClick={handleGoBack}>
        <ArrowBackIcon fontSize="large" sx={{ margin: "3vh 0 0 3vh", color: "black" }} />
      </Link>
      <Stack spacing={2} alignItems="center" justifyContent="center" style={{ minHeight: "80vh" }}>
        <Avatar alt="Anya" sx={avatar}>
          <Image
            src={image}
            alt="Upload avatar"
            width={200}
            height={200}
            style={!isImageUpload ? { opacity: "0.5" } : { objectFit: "cover" }}
          />
          <IconButton sx={overlayIcon} aria-label="upload picture" component="label">
            <input onChange={handleImageChange} hidden accept="image/*" type="file" />
            <CameraAltIcon sx={{ fontSize: "100px" }} />
          </IconButton>
        </Avatar>

        {showImageUploadError.err && (
          <Typography align="center" variant="body1" color="error">
            {showImageUploadError.msg}
          </Typography>
        )}

        <Box style={editInfoContainer}>
          <InputTextBox
            header={editProfileHeader.displayName}
            value={displayName}
            handleValueChange={handleDisplayNameChange}
            char_limit={CHAR_LIMIT.DISPLAY_NAME_LIMIT}
            isErr={isPressSubmit && displayNameErr.err}
            errMsg={displayNameErr.msg}
          />

          <InputTextBox
            header={editProfileHeader.description}
            value={description}
            handleValueChange={handleDescChange}
            isMultiLine={true}
            char_limit={CHAR_LIMIT.DESCRIPTION_LIMIT}
            isErr={isPressSubmit && descriptionErr.err}
            errMsg={descriptionErr.msg}
          />

          <Typography variant="body1">{editProfileHeader.gender}</Typography>
          <FormControl size="small" sx={{ width: "18vw" }}>
            <Select value={gender} onChange={handleSelectChange}>
              {(Object.keys(Gender) as (keyof typeof Gender)[]).map((key) => (
                <MenuItem key={Gender[key]} value={Gender[key]}>
                  {Gender[key]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Button variant="contained" onClick={editProfileBtnOnClick}>
          SAVE
        </Button>
        <Typography variant="body1" color="warning.main">
          ท่านต้องกด SAVE เพื่อบันทึกข้อมูลใหม่
        </Typography>
      </Stack>
    </>
  );
}
