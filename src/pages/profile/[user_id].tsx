import React, { Suspense, useContext, useEffect, useState } from "react";
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
import { User } from "@/types/User";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";

// style
const profile_layout = {
  width: "30vw",
  minWidth: "200px",
};

const owner: boolean = true;
const avatar = { width: 200, height: 200 };

export default function Home() {
  const router: NextRouter = useRouter();
  const userStatus = useContext(userContext);
  const [targetUserData, setTargetUserData] = useState<User | null>(null);
  const supabaseClient = useSupabaseClient<Database>();

  useEffect(() => {
    async function getTargetUserData() {
      if (!userStatus.user || !router.query.user_id || targetUserData) return;
      const getUserDataResult = await supabaseClient.rpc("get_user_data_by_id", {
        target_id: router.query.user_id as string,
      });
      if (getUserDataResult.error || getUserDataResult.count == 0) {
        console.log(getUserDataResult.error ? getUserDataResult.error : "no user");
        return;
      }
      setTargetUserData(getUserDataResult.data[0]);
    }

    getTargetUserData();
  }, [router.query.user_id, supabaseClient, userStatus.user, targetUserData]);

  function handleEditProfile(): void {
    router.push(PagePaths.editProfile);
    return;
  }

  if (userStatus.isLoading) return <Loading />;
  if (!userStatus.user){
    router.push(PagePaths.login);
    return ;
  }
  if (!targetUserData) return <Loading />;
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
          <Typography variant="h1" align="center" sx={profile_layout}>
            {targetUserData.username}
          </Typography>
          {router.query.user_id === userStatus.user.user_id && (
            <Typography variant="body1" align="center" sx={profile_layout}>
              {targetUserData.email}
            </Typography>
          )}
          <Avatar sx={avatar} alt="Profile picture" src={targetUserData.image as string} />
          <Stack direction="row" spacing={1}>
            <Chip
              icon={
                targetUserData.sex === Gender.male ? (
                  <MaleIcon />
                ) : targetUserData.sex === Gender.female ? (
                  <FemaleIcon />
                ) : targetUserData.sex === Gender.others ? (
                  <TransgenderIcon />
                ) : (
                  <div></div>
                )
              }
              label={targetUserData.sex}
            />
            <Chip icon={<CakeIcon />} label={targetUserData.birthdate} />
          </Stack>

          {targetUserData.description.split("\n").map((row) => (
            <Typography
              variant="body1"
              sx={{ ...profile_layout, wordBreak: "break-word" }}
              key={row}
            >
              {row}
            </Typography>
          ))}
          {router.query.user_id === userStatus.user.user_id && (
            <IconButton onClick={handleEditProfile}>
              <EditIcon />
            </IconButton>
          )}
        </Stack>
      </Suspense>
    </>
  );
}
