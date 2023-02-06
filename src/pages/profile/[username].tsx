import React from "react";
import { useRouter } from "next/router";
import { Avatar, IconButton, Chip, Typography, Stack } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import CakeIcon from "@mui/icons-material/Cake";

import { useSessionContext } from "@supabase/auth-helpers-react";

import Navbar from "@/components/public/Navbar";

import { User } from "@/types/User";

import { PagePaths } from "enum/pages";
import { Gender } from "enum/gender";

const owner: boolean = true;
const avatar = { width: 200, height: 200 };

export default function Home() {
  const router = useRouter();

  const [userData, setUserData] = React.useState<User | null>(null);
  const [username, setUsername] = React.useState<string>("");

  const sessionContext = useSessionContext();

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
    if (userData) setUsername(userData.username);
  }, [router, sessionContext, userData]);

  function handleEditProfile() {
    router.push(PagePaths.editProfile + "/" + username);
    return;
  }

  if (sessionContext.isLoading) return <p>getting session...</p>; //temporary display
  if (sessionContext.session == null) return <p>log in first</p>; // temporary display
  if (userData == null) return <p>getting the user data</p>; // temporary display
  return (
    <>
      <Navbar user={userData} session={sessionContext} />
      <Stack spacing={2} alignItems="center" justifyContent="center" style={{ minHeight: "90vh" }}>
        <Typography variant="h1">{userData.name}</Typography>
        {owner && <Typography variant="body1">{userData.email}</Typography>}
        <Avatar sx={avatar} alt="Profile picture" src={userData.image} />
        <Stack direction="row" spacing={1}>
          <Chip
            icon={
              userData.sex === Gender.male ? (
                <MaleIcon />
              ) : userData.sex === Gender.female ? (
                <FemaleIcon />
              ) : (
                <TransgenderIcon />
              )
            }
            label={userData.sex}
          />
          <Chip icon={<CakeIcon />} label={userData.birthdate} />
        </Stack>
        <Typography variant="body1">{userData.description}</Typography>
        {owner && (
          <IconButton>
            <EditIcon onClick={handleEditProfile} />
          </IconButton>
        )}
      </Stack>
    </>
  );
}
