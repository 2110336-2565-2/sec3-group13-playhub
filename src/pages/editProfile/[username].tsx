import { useState, useEffect } from "react";
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
import { useRouter } from "next/router";
import React from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";

export default function Home() {
  const tmpUser: User = {
    username: "aomkung",
    name: "Chanathip sombuthong",
    sex: "Male",
    birthdate: "26/4/2002",
    description: "ชอบเล่นแนวบลัฟครับ หรือจะไปเล่นห้องผมก็ได้นะ",
    image: "/images/aom.jpg",
    email: "aom@gmail.com",
  };

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

  const router = useRouter();

  const sessionContext = useSessionContext();

  const controller = new AbortController();

  const [userData, setUserData] = React.useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [gender, setGender] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const [isPressSubmit, setIsPressSubmit] = useState(false);
  const [fileImage, setFileImage] = useState({});
  const [isImageUpload, setIsImageUpload] = useState(true);
  const [showImageUploadError, setShowImageUploadError] = useState({
    msg: "",
    err: false,
  });

  const displayNameErr = validateTextField(displayName, 1, CHAR_LIMIT.DISPLAY_NAME_LIMIT);
  const descriptionErr = validateTextField(description, 0, CHAR_LIMIT.DESCRIPTION_LIMIT);

  const getProfile = async (User: User) => {
    setDisplayName(User.name);
    setDescription(User.description);
    setGender(User.sex);
    setImage(User.image);
  };

  const editProfileBtnOnClick = async () => {
    setIsPressSubmit(true);
    const readyToSubmit: boolean = !(displayNameErr.err || descriptionErr.err || !isImageUpload);
    if (readyToSubmit) {
      //send to API
      console.log("Edit success");
      const sendData = {
        name: displayName,
        sex: gender,
        description: description,
        image: fileImage,
      };
      console.log(sendData);
    } else {
      console.log("Something went wrong");
    }
  };

  React.useEffect(() => {
    async function getUserData() {
      if (!router.query.username || !sessionContext.session || userData) return;
      const fetchResult = await sessionContext.supabaseClient
        .from("User")
        .select("username,name,sex,birthdate,description,image,email")
        .eq("username", router.query.username);
      if (fetchResult.error) {
        // having query error
        console.log(fetchResult.error);
        return;
      }
      if (fetchResult.count == 0) {
        // no data entry with matching username
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

  const handleImageChange = (event: any) => {
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
  ) => {
    setDisplayName(event.target.value);
    setIsPressSubmit(false);
  };
  const handleDescChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setDescription(event.target.value);
    setIsPressSubmit(false);
  };
  const handleSelectChange = (event: SelectChangeEvent) => {
    setGender(event.target.value as string);
  };

  function handleGoBack() {
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
          <Typography variant="body1">{editProfileHeader.displayName}</Typography>
          <TextField
            value={displayName}
            onChange={handleDisplayNameChange}
            fullWidth
            size="small"
          />
          <Box sx={helperText}>
            <FormHelperText>
              {displayName.length}/{CHAR_LIMIT.DISPLAY_NAME_LIMIT}
            </FormHelperText>
            {isPressSubmit && displayNameErr.err && (
              <FormHelperText error={true}>{displayNameErr.msg}</FormHelperText>
            )}
          </Box>

          <Typography variant="body1">{editProfileHeader.description}</Typography>
          <TextField
            id="outlined-multiline-flexible"
            value={description}
            onChange={handleDescChange}
            multiline
            rows={4}
            fullWidth
            size="small"
          />
          <Box sx={helperText}>
            <FormHelperText>
              {description.length}/{CHAR_LIMIT.DESCRIPTION_LIMIT}
            </FormHelperText>
            {isPressSubmit && descriptionErr.err && (
              <FormHelperText error>{descriptionErr.msg}</FormHelperText>
            )}
          </Box>

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
