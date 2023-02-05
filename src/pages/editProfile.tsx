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
} from "@mui/material";

import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { editProfileHeader } from "public/locales/editProfileHeader";
import { Gender } from "enum/gender";
import { CHAR_LIMIT } from "enum/character_limit";

import { User } from "@/types/User";

import Image from "next/image";
import Link from "next/link";

import { PagePaths } from "enum/pages";

export default function Home() {
  const tmpUser: User = {
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
    fontSize: "7.5vw",
    opacity: "0.5",
  };
  const imgErrorWarning = {
    display: "none",
  };
  const editInfoContainer = {
    width: "50vw",
    margin: "3vh 0 0 0",
  };
  const helperTextBox = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
  };
  const helperTextError = {
    textAlign: "start",
    gridColumn: 1,
    display: "none",
  };
  const helperText = {
    textAlign: "end",
    gridColumn: 2,
  };

  const controller = new AbortController();
  const [displayName, setDisplayName] = useState("");
  const [gender, setGender] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const getProfile = async (User: User) => {
    setDisplayName(User.name);
    setDescription(User.description);
    setGender(User.sex);
    setImage(User.image);
  };
  // const editProfileBtnOnClick = async () => {};

  useEffect(() => {
    getProfile(tmpUser);
    // clean up
    return () => controller.abort();
  }, []);

  const handleDisplayNameChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setDisplayName(event.target.value);
  };
  const handleDescChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };
  const handleSelectChange = (event: SelectChangeEvent) => {
    setGender(event.target.value as string);
  };

  return (
    <>
      <Navbar />
      <Link href={PagePaths.profile}>
        <ArrowBackIcon
          fontSize="large"
          sx={{ margin: "3vh 0 0 3vh", color: "black" }}
        />
      </Link>
      <Stack
        spacing={2}
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "80vh" }}
      >
        <Avatar alt="Anya" sx={avatar}>
          <Image
            src={image}
            alt="Upload avatar"
            width={200}
            height={200}
            style={{
              position: "relative",
              opacity: "0.5",
            }}
          />
          <CameraAltIcon sx={overlayIcon} />
        </Avatar>

        {/* image error warning */}
        <Box sx={imgErrorWarning}>
          <Typography variant="body1" color="error">
            นามสกุลไฟล์ที่อัปโหลดไม่ถูกต้อง (.jpeg หรือ .png)
            ขนาดไฟล์จะต้องไม่เกิน 1 MB
          </Typography>
          <Typography align="center" variant="body1" color="error">
            ขนาดไฟล์จะต้องไม่เกิน 1 MB
          </Typography>
        </Box>

        <Box style={editInfoContainer}>
          <Typography variant="body1">
            {editProfileHeader.displayName}
          </Typography>
          <TextField
            value={displayName}
            onChange={handleDisplayNameChange}
            fullWidth
            size="small"
          />
          <Box style={helperTextBox}>
            <FormHelperText error={true} sx={helperTextError}>
              ช่องนี้ไม่สามารถเว้นว่างได้
            </FormHelperText>
            <FormHelperText sx={helperText}>
              {displayName.length}/{CHAR_LIMIT.DISPLAY_NAME_LIMIT}
            </FormHelperText>
          </Box>

          <Typography variant="body1">
            {editProfileHeader.description}
          </Typography>
          <TextField
            id="outlined-multiline-flexible"
            value={description}
            onChange={handleDescChange}
            multiline
            rows={4}
            fullWidth
            size="small"
          />
          <Box style={helperTextBox}>
            <FormHelperText error={true} sx={helperTextError}>
              {`ช่องนี้มีตัวอักษรได้ไม่เกิน ${"xxx"} ตัว`}
            </FormHelperText>
            <FormHelperText sx={helperText}>
              {description.length}/{CHAR_LIMIT.DESCRIPTION_LIMIT}
            </FormHelperText>
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

        <Button
          variant="contained"
          onClick={() => console.log("SAVE BUTTON IS CLICKED")}
        >
          SAVE
        </Button>
        <Typography variant="body1" color="warning.main">
          ท่านต้องกด SAVE เพื่อบันทึกข้อมูลใหม่
        </Typography>
      </Stack>
    </>
  );
}
