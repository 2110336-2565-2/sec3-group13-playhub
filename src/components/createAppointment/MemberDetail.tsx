import { Suspense, useEffect, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { grey } from "@mui/material/colors";
import { Tag } from "@/types/Tag";

import { Avatar, IconButton, Chip, Typography, Stack } from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import CakeIcon from "@mui/icons-material/Cake";
import EditIcon from "@mui/icons-material/Edit";

import Navbar from "@/components/public/Navbar";
import Loading from "@/components/public/Loading";

import { User } from "@/types/User";
import { PagePaths } from "enum/pages";
import { Gender } from "enum/gender";
import { GetUserByUserId } from "@/services/User";
import { setTextRange } from "typescript";
type props = {
  value: User | null;
};
const profile_layout = {
  /*width: "30vw",
  minWidth: "200px",*/
  width: "250px",
  height: "220px",
  boxSizing: "border-box",
  position: "absolute",
  background: "#FFFFFF",
  border: "1px solid rgba(0, 0, 0, 0.2)",
  borderRadius: " 15px",
};

const avatar = { width: 50, height: 50 };

export default function MemberDetail(props: props) {
  /*const [text, setText] = useState<string>("");
  setText(props.value.description);*/
  return (
    <>
      {props.value && (
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "90vh" }}
        >
          <Typography variant="h1" align="center" sx={profile_layout}>
            {props.value.username}
          </Typography>
          <Typography variant="body1" align="center" sx={profile_layout}>
            {props.value.email}
          </Typography>
          <Avatar sx={avatar} alt="Profile picture" src={props.value.image as string} />
          <Stack direction="row" spacing={1}>
            <Chip
              icon={
                props.value.sex === Gender.male ? (
                  <MaleIcon />
                ) : props.value.sex === Gender.female ? (
                  <FemaleIcon />
                ) : props.value.sex === Gender.others ? (
                  <TransgenderIcon />
                ) : (
                  <div></div>
                )
              }
              label={props.value.sex}
            />
            <Chip icon={<CakeIcon />} label={props.value.birthdate} />
          </Stack>

          {/*text.split("\n").map((row) => (
          <Typography variant="body1" sx={{ ...profile_layout, wordBreak: "break-word" }} key={row}>
            {row}
          </Typography>
        ))*/}
        </Stack>
      )}
    </>
  );
}
