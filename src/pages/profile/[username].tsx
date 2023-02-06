import React, { Suspense } from "react";
import { NextRouter, useRouter } from "next/router";
import { SessionContext, useSessionContext } from "@supabase/auth-helpers-react";
import { Avatar, IconButton, Chip, Typography, Stack } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import CakeIcon from "@mui/icons-material/Cake";

import Navbar from "@/components/public/Navbar";
import Loading from "@/components/public/Loading";

import { User } from "@/types/User";

import { PagePaths } from "enum/pages";
import { Gender } from "enum/gender";

const owner: boolean = true;
const avatar = { width: 200, height: 200 };

export default function Home() {
  const router: NextRouter = useRouter();
  const sessionContext: SessionContext = useSessionContext();
  const controller = new AbortController();

  // state about variables
  const [userData, setUserData] = React.useState<User | null>(null);

  React.useEffect(() => {
    async function getUserData() {
      // in case : the user is invalid
      if (!router.query.username || !sessionContext.session || userData) {
        return;
      }

      // retrieve user data from supabase
      const fetchResult = await sessionContext.supabaseClient
        .from("User")
        .select("username,name,sex,birthdate,description,image,email")
        .eq("username", router.query.username);

      // in case : quering is error
      if (fetchResult.error) {
        console.log(fetchResult.error);
        return;
      }

      // in case :no data entry with matching username
      if (fetchResult.count == 0) {
        console.log("cant find the user");
        router.push(PagePaths.login);
        return;
      }

      setUserData(fetchResult.data[0]);
      return () => controller.abort();
    }

    getUserData();
  }, [router, sessionContext, userData]);

  function handleEditProfile(): void {
    router.push(PagePaths.editProfile + "/" + userData?.username);
    return;
  }

  if (sessionContext.isLoading) return <p>getting session...</p>; //temporary display
  if (sessionContext.session == null) return <p>log in first</p>; // temporary display
  if (userData == null) return <p>getting the user data</p>; // temporary display

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Navbar />
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "90vh" }}
        >
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
      </Suspense>
    </>
  );
}
