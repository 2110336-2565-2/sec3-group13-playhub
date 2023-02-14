import React, { useState, useContext } from "react";
import Image from "next/image";
import { NextRouter, useRouter } from "next/router";
import {
  Typography,
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
import CancelIcon from '@mui/icons-material/Cancel';

import { editProfileHeader } from "public/locales/editProfileHeader";
import { Gender } from "enum/gender";
import { CHAR_LIMIT } from "enum/inputLimit";
import { PagePaths } from "enum/pages";

import { User } from "@/types/User";
import { validation } from "@/types/Validation";

import Navbar from "@/components/public/Navbar";
import CommonTextField from "@/components/public/CommonTextField";
import CommonDropdown from "@/components/public/CommonDropdown";
import { validateImage, validateTextField } from "@/utilities/validation";

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { userContext } from "supabase/user_context";
import Loading from "@/components/public/Loading";

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

  const router: NextRouter = useRouter();

  const [displayName, setDisplayName] = React.useState<string>("");
  const [gender, setGender] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [image, setImage] = React.useState<string | null>(null);
  const [originalImage, setOriginalImage] = React.useState<string | null>(null);

  const [isPressSubmit, setIsPressSubmit] = React.useState<boolean>(false);
  const [fileImage, setFileImage] = React.useState<File | null>();
  const [isImageUpload, setIsImageUpload] = React.useState<boolean>(false);
  const [showImageUploadError, setShowImageUploadError] = useState({
    msg: "",
    err: false,
  });

  const displayNameErr: validation = validateTextField(
    displayName,
    CHAR_LIMIT.MIN_DISPLAY_NAME,
    CHAR_LIMIT.MAX_DISPLAY_NAME
  );
  const descriptionErr: validation = validateTextField(
    description,
    CHAR_LIMIT.MIN_DESCRIPTION,
    CHAR_LIMIT.MAX_DESCRIPTION
  );

  const getProfile = async (User: User) => {
    setDisplayName(User.name);
    setDescription(User.description);
    setGender(User.sex);
    setImage(User.image);
    setOriginalImage(User.image);
  };

  const editProfileBtnOnClick = async () => {
    if (!userStatus.user) return;
    setIsPressSubmit(true);
    const readyToSubmit: boolean = !(
      displayNameErr.err ||
      descriptionErr.err ||
      showImageUploadError.err
    );
    if (readyToSubmit) {
      //send to API
      const timeStamp = Date.now();
      if (fileImage) {
        if (userStatus.user.image) {
          const deleteImageResult = await supabaseClient.storage
            .from("profileimage")
            .remove([userStatus.user.image.split("/").at(-1) as string]);
          if (deleteImageResult.error != null) {
            console.log(deleteImageResult.error);
            return;
          }
        }

        const uploadImageResult = await supabaseClient.storage
          .from("profileimage")
          .upload(userStatus.user.user_id + timeStamp, fileImage);
        if (uploadImageResult.error != null) {
          console.log(uploadImageResult.error);
          return;
        }
      }
      const getImageURLResult = await supabaseClient.storage
        .from("profileimage")
        .getPublicUrl(userStatus.user.user_id + timeStamp);

      const sendData =
        fileImage != null
          ? {
              name: displayName,
              sex: gender,
              description: description,
              image: getImageURLResult.data.publicUrl,
            }
          : {
              name: displayName,
              sex: gender,
              description: description,
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

  const handleImageChange = (event: any): void => {
    const tempFile = event.target.files[0];
    setImage(URL.createObjectURL(tempFile));
    const imgErrMsg = validateImage(tempFile.type, tempFile.size);
    setShowImageUploadError(imgErrMsg);
    setIsImageUpload(true);
    if (!imgErrMsg.err) {
      setFileImage(event.target.files[0]);
    }
    event.target.value = null;
  };
  const handleCancelImageChip = (): void => {
    setIsImageUpload(false);
    setShowImageUploadError({ msg: "", err: false });
    setImage(originalImage);
    setFileImage(null);
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
    router.push(PagePaths.profile + "/" + userStatus.user?.username);
    return;
  }

  React.useEffect(() => {
    if (userStatus.isLoading || !userStatus.user) return;
    getProfile(userStatus.user);
  }, [userStatus]);

  
  if (userStatus.isLoading) return <Loading />;
  if (!userStatus.user){
    router.push(PagePaths.login);
    return ;
  }
  return (
    <>
      <Navbar />
      <Link onClick={handleGoBack}>
        <ArrowBackIcon fontSize="large" sx={{position:"absolute",margin: "3vh 0 0 3vh", color: "black" }} />
      </Link>
      <Stack
        spacing={2}
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "80vh", marginBottom: "10vh" }}
      >
        <CancelIcon
          onClick={handleCancelImageChip}
          color={showImageUploadError.err ? "error" : "secondary"}
          sx={{position:"relative",top:"70px",left:"80px",zIndex:"1"}}
          fontSize="large"
          cursor="pointer"
        />

        <Avatar alt="Anya" sx={avatar}>
          {image && (
            <Image
              src={image}
              alt="Upload avatar"
              width={200}
              height={200}
              style={!isImageUpload ? { opacity: "0.5" } : { objectFit: "cover" }}
            />
          )}
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
          <CommonTextField
            header={editProfileHeader.displayName}
            value={displayName}
            handleValueChange={handleDisplayNameChange}
            char_limit={CHAR_LIMIT.MAX_DISPLAY_NAME}
            isErr={isPressSubmit && displayNameErr.err}
            errMsg={displayNameErr.msg}
          />

          <CommonTextField
            header={editProfileHeader.description}
            value={description}
            handleValueChange={handleDescChange}
            isMultiLine={true}
            char_limit={CHAR_LIMIT.MAX_DESCRIPTION}
            isErr={isPressSubmit && descriptionErr.err}
            errMsg={descriptionErr.msg}
          />

          <Box style={{ width: "18vw" }}>
            <CommonDropdown
              header={editProfileHeader.gender}
              value={gender}
              handleValueChange={handleSelectChange}
              items={Object.values(Gender)}
            />
          </Box>
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
