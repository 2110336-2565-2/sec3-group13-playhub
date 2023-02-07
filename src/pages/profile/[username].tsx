import React, { Suspense, useContext } from "react";
import { NextRouter, useRouter } from "next/router";
import { Avatar, IconButton, Chip, Typography, Stack } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import CakeIcon from "@mui/icons-material/Cake";

import Navbar from "@/components/public/Navbar";
import Loading from "@/components/public/Loading";

import { PagePaths } from "enum/pages";
import { Gender } from "enum/gender";
import { userContext } from "supabase/user_context";

const owner: boolean = true;
const avatar = { width: 200, height: 200 };

export default function Home() {
  const router: NextRouter = useRouter();
  const userStatus = useContext(userContext);

  function handleEditProfile(): void {
    router.push(PagePaths.editProfile + "/" + userStatus.user?.username);
    return;
  }

  if (userStatus.isLoading) return <p>getting session...</p>; //temporary display
  if (!userStatus.user) return <p>log in first</p>; // temporary display

  return (
    <>
      <Suspense fallback={<Loading isLoading={userStatus.isLoading} />}>
        <Navbar />
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "90vh" }}
        >
          <Typography variant="h1">{userStatus.user.name}</Typography>
          {owner && <Typography variant="body1">{userStatus.user.email}</Typography>}
          <Avatar sx={avatar} alt="Profile picture" src={userStatus.user.image} />
          <Stack direction="row" spacing={1}>
            <Chip
              icon={
                userStatus.user.sex === Gender.male ? (
                  <MaleIcon />
                ) : userStatus.user.sex === Gender.female ? (
                  <FemaleIcon />
                ) : userStatus.user.sex === Gender.others ? (
                  <TransgenderIcon />
                ) : (
                  <div></div>
                )
              }
              label={userStatus.user.sex}
            />
            <Chip icon={<CakeIcon />} label={userStatus.user.birthdate} />
          </Stack>
          <Typography variant="body1">{userStatus.user.description}</Typography>
          {owner && (
            <IconButton onClick={handleEditProfile}>
              <EditIcon />
            </IconButton>
          )}
        </Stack>
      </Suspense>
    </>
  );
}
