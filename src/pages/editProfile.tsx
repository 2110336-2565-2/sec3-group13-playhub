import { useState, useEffect } from "react";
import Navbar from "@/components/public/Navbar";
import {
  Avatar,
  Grid,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  FormHelperText,
} from "@mui/material";

import CameraAltIcon from "@mui/icons-material/CameraAlt";

import { editProfileHeader } from "public/locales/editProfileHeader";
import styles from "../styles/profile.module.scss";
import { Gender } from "enum/gender";

type User = {
  name: string;
  sex: string;
  brithdate: string;
  description: string;
  image: string;
  email: string;
};

export default function Home() {
  const tmpUser: User = {
    name: "Chanathip sombuthong",
    sex: "Male",
    brithdate: "26/4/2002",
    description: "ชอบเล่นแนวบลัฟครับ หรือจะไปเล่นห้องผมก็ได้นะ",
    image: "/images/aom.jpg",
    email: "aom@gmail.com",
  };

  const controller = new AbortController();
  const [displayName, setDisplayName] = useState("");
  const [gender, setGender] = useState({});
  const [description, setDescription] = useState("");
  const [image, setImage] = useState({});

  // const getProfile = async () => {};
  // const editProfileBtnOnClick = async () => {};

  useEffect(() => {
    // getProfile();
    // clean up
    return () => controller.abort();
  }, []);

  return (
    <>
      <Navbar />
      <Grid container direction="column" spacing={2} className={`${styles["grid-container"]}`}>
        <Grid item>
          <Avatar alt="Anya" className={`${styles["avatar"]}`}>
            <div className={`${styles["avatar-img-container"]}`}>
              <img src={tmpUser.image} className={`${styles["avatar-img"]}`} />
            </div>
            <CameraAltIcon className={`${styles["overlay-img"]}`} />
          </Avatar>
        </Grid>
        <Grid item className={`${styles["img-warning"]} ${styles["warning-txt"]}`}>
          <Typography variant="body1">
            นามสกุลไฟล์ที่อัปโหลดไม่ถูกต้อง (.jpeg หรือ .png) ขนาดไฟล์จะต้องไม่เกิน 1 MB
          </Typography>
          <Typography variant="body1">ขนาดไฟล์จะต้องไม่เกิน 1 MB</Typography>
        </Grid>
        <div className={`${styles["edit-info-container"]}`}>
          <Grid item>
            <Typography variant="body1">{editProfileHeader.displayName}</Typography>
            <TextField variant="outlined" fullWidth size="small" />
            <div className={`${styles["helper-text-box"]}`}>
              <FormHelperText className={`${styles["helper-text-error"]}`}>
                ช่องนี้ไม่สามารถเว้นว่างได้
              </FormHelperText>
              <FormHelperText className={`${styles["helper-text"]}`}>123/xxx</FormHelperText>
            </div>
          </Grid>
          <Grid item>
            <Typography variant="body1">{editProfileHeader.description}</Typography>
            <TextField
              id="outlined-multiline-flexible"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              size="small"
            />
            <div className={`${styles["helper-text-box"]}`}>
              <FormHelperText className={`${styles["helper-text-error"]}`}>
                {`ช่องนี้มีตัวอักษรได้ไม่เกิน ${"xxx"} ตัว`}
              </FormHelperText>
              <FormHelperText className={`${styles["helper-text"]}`}>123/xxx</FormHelperText>
            </div>
          </Grid>
          <Grid item>
            <Typography variant="body1">{editProfileHeader.gender}</Typography>
            <FormControl size="small" sx={{ width: "18vw" }}>
              <Select
                value={tmpUser.sex}
                // onChange={handleChange}
              >
                {(Object.keys(Gender) as (keyof typeof Gender)[]).map((key) => (
                  <MenuItem>{Gender[key]}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </div>
        <Grid item>
          <Button variant="contained" className={`${styles["save-btn"]}`}>
            SAVE
          </Button>
        </Grid>
        <Grid item>
          <Typography variant="body1" className={`${styles["warning-txt"]}`}>
            ท่านต้องกด SAVE เพื่อบันทึกข้อมูลใหม่
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}
