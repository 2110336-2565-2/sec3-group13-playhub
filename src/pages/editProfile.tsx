import Navbar from "@/components/Navbar";
import {
  Avatar,
  Grid,
  IconButton,
  Typography,
  Divider,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
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

  const owner: boolean = false;

  return (
    <>
      <Navbar />
      <Grid
        container
        direction="column"
        spacing={2}
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "80vh" }}
        marginTop="5vh"
      >
        <Grid item>
          <Avatar alt="Anya" className={`${styles["avatar"]}`}>
            <div className={`${styles["avatar-img-container"]}`}>
              <img src={tmpUser.image} className={`${styles["avatar-img"]}`} />
            </div>
            <CameraAltIcon className={`${styles["overlay-img"]}`} />
          </Avatar>
        </Grid>
        <Grid item>
          <Typography variant="body1">{editProfileHeader.displayName}</Typography>
          <TextField id="outlined-basic" variant="outlined" helperText="123/xxx" />
        </Grid>
        <Grid item>
          <Typography variant="body1">{editProfileHeader.description}</Typography>
          <TextField id="outlined-basic" variant="outlined" helperText="123/xxx" />
        </Grid>
        <Grid item>
          <Typography variant="body1">{editProfileHeader.gender}</Typography>
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={tmpUser.sex}
              // onChange={handleChange}
            >
              {(Object.keys(Gender) as (keyof typeof Gender)[]).map((key) => (
                <MenuItem>{Gender[key]}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
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
