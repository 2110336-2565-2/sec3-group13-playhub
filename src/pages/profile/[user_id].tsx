import { Suspense, useContext, useEffect, useState } from "react";
import { NextRouter, useRouter } from "next/router";

import { userContext } from "supabase/user_context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { Avatar, IconButton, Chip, Typography, Stack, Card } from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CakeIcon from "@mui/icons-material/Cake";
import EditIcon from "@mui/icons-material/Edit";

import Navbar from "@/components/public/Navbar";
import Loading from "@/components/public/Loading";
import VerifyChip from "@/components/profile/VerifyChip";

import { User } from "@/types/User";
import { PAGE_PATHS } from "enum/PAGES";
import { GENDER } from "enum/GENDER";
import { GetUserByUserId } from "@/services/User";

const MyProfileStyle = {
  Card: {
    width: "50vw",
    minWidth: "300px",

    marginTop: "3vh",
    marginBottom: "3vh",

    paddingTop: "10vh",
    paddingBottom: "15vh",
  },
  TextField: {
    width: "30vw",
    minWidth: "200px",
  },
  Avatar: {
    width: 200,
    height: 200,
    border: "4px black solid",
  },
  Chip: {
    border: "2px black solid",
    boxShadow: "4px 4px 1px grey",
    "& .MuiChip-icon": {
      color: "black",
    },
  },
};

export default function Home() {
  const router: NextRouter = useRouter();
  const userStatus = useContext(userContext);
  const supabaseClient = useSupabaseClient<Database>();

  const [targetUserData, setTargetUserData] = useState<User | null>(null);

  useEffect(() => {
    async function getTargetUserData() {
      if (!userStatus.user || !router.query.user_id || targetUserData) return;
      const userData = await GetUserByUserId(router.query.user_id as string, supabaseClient);
      setTargetUserData(userData);
    }

    getTargetUserData();
  }, [router.query.user_id, supabaseClient, userStatus.user, targetUserData]);

  function handleEditProfile(): void {
    router.push(PAGE_PATHS.EDIT_PROFILE);
    return;
  }

  function displayGenderIcon(gender: string) {
    if (gender === GENDER.MALE) {
      return <MaleIcon />;
    } else if (gender === GENDER.FEMALE) {
      return <FemaleIcon />;
    } else if (gender === GENDER.OTHERS) {
      return <TransgenderIcon />;
    } else if (gender === GENDER.PREFERS_NOT_TO_SAY) {
      return <FavoriteIcon />;
    } else {
      return <div></div>;
    }
  }

  if (userStatus.isLoading) return <Loading />;
  if (!userStatus.user) {
    router.push(PAGE_PATHS.LOGIN);
    return;
  }
  if (userStatus.user.isAdmin) {
    router.push(PAGE_PATHS.ADMIN_PROFILE + router.query.user_id);
    return;
  }
  if (!targetUserData) return <Loading />;
  if (targetUserData.isAdmin) {
    router.push(PAGE_PATHS.HOME + userStatus.user.userId);
    return;
  }
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Navbar />
        <Stack alignItems="center">
          <Card sx={MyProfileStyle.Card}>
            <Stack spacing={3} alignItems="center" justifyContent="center">
              <Typography variant="h1" align="center" sx={MyProfileStyle.TextField}>
                {targetUserData.username}
              </Typography>

              {router.query.user_id === userStatus.user.userId && (
                <Typography
                  variant="body1"
                  align="center"
                  sx={{ ...MyProfileStyle.TextField, fontWeight: 500 }}
                >
                  {targetUserData.email}
                </Typography>
              )}

              <Avatar
                sx={MyProfileStyle.Avatar}
                alt="Profile picture"
                src={targetUserData.image as string}
              />

              <Stack spacing={1.5} alignItems="center" justifyContent="center">
                {targetUserData.isVerified && <VerifyChip />}
                <Chip
                  icon={displayGenderIcon(targetUserData.sex)}
                  label={targetUserData.sex}
                  sx={MyProfileStyle.Chip}
                />
                <Chip
                  icon={<CakeIcon />}
                  label={targetUserData.birthdate}
                  sx={MyProfileStyle.Chip}
                />
              </Stack>
              {targetUserData.description.length === 0 && (
                <Stack spacing={0}>
                  {`" ${targetUserData.description} "`.split("\n").map((row, index) => (
                    <Typography
                      variant="body1"
                      sx={{
                        maxWidth: "30vw",
                        wordBreak: "break-word",
                        textAlign: "center",
                      }}
                      key={index}
                    >
                      {row}
                    </Typography>
                  ))}
                </Stack>
              )}
              {router.query.user_id === userStatus.user.userId && (
                <IconButton onClick={handleEditProfile}>
                  <EditIcon color="secondary" />
                </IconButton>
              )}
            </Stack>
          </Card>
        </Stack>
      </Suspense>
    </>
  );
}
