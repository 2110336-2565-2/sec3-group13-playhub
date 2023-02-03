import { Avatar, IconButton, Chip, Typography, Stack } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import CakeIcon from "@mui/icons-material/Cake";

import { User } from "@/types/User";
import Navbar from "@/components/public/Navbar";
import { Gender } from "enum/gender";

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

export default function Home() {
  function handleEdit(): void {}

  return (
    <>
      <Navbar />
      <Stack spacing={2} alignItems="center" justifyContent="center" style={{ minHeight: "90vh" }}>
        <Typography variant="h1">{tmpUser.name}</Typography>
        {owner && <Typography variant="body1">{tmpUser.email}</Typography>}
        <Avatar sx={avatar} alt="Profile picture" src={tmpUser.image} />
        <Stack direction="row" spacing={1}>
          <Chip
            icon={
              tmpUser.sex === Gender.male ? (
                <MaleIcon />
              ) : tmpUser.sex === Gender.female ? (
                <FemaleIcon />
              ) : (
                <TransgenderIcon />
              )
            }
            label={tmpUser.sex}
          />
          <Chip icon={<CakeIcon />} label={tmpUser.birthdate} />
        </Stack>
        <Typography variant="body1">{tmpUser.description}</Typography>
        {owner && (
          <IconButton onClick={handleEdit}>
            <EditIcon />
          </IconButton>
        )}
      </Stack>
    </>
  );
}
