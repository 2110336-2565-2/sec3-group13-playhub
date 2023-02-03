import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import EditIcon from "@mui/icons-material/Edit";
import MaleIcon from "@mui/icons-material/Male";
import CakeIcon from "@mui/icons-material/Cake";

import { User } from "@/types/User";
import Navbar from "@/components/public/Navbar";

// mocked user information
const tmpUser: User = {
  name: "Chanathip sombuthong",
  sex: "Male",
  birthdate: "26/4/2002",
  description: "ชอบเล่นแนวบลัฟครับ หรือจะไปเล่นห้องผมก็ได้นะ",
  image: "/images/aom.jpg",
  email: "aom@gmail.com",
};
const owner: boolean = true;
const avatar = { width: 200, height: 200 };

const email_txt = {
  fontSize: "body1.fontSize",
  fontWeight: "regular",
  textAlign: "center",
  m: 1,
};

const desc_txt = {
  fontSize: "body1.fontSize",
  fontWeight: "bold",
  textAlign: "center",
  m: 1,
};

const avatar = { width: 200, height: 200 };

export default function Home() {
  return (
    <>
      <Navbar />
      <Stack spacing={2} alignItems="center" justifyContent="center" style={{ minHeight: "90vh" }}>
        <Typography variant="h1">{tmpUser.name}</Typography>
        {owner && <Typography variant="body1">{tmpUser.email}</Typography>}
        <Avatar sx={avatar} alt="Profile picture" src={tmpUser.image} />
        <Stack direction="row" spacing={1}>
          <Chip icon={<MaleIcon />} label={tmpUser.sex} />
          <Chip icon={<CakeIcon />} label={tmpUser.birthdate} />
        </Stack>
        <Typography variant="body1">{tmpUser.description}</Typography>
        {owner && (
          <IconButton>
            <EditIcon />
          </IconButton>
        )}
      </Stack>
    </>
  );
}
