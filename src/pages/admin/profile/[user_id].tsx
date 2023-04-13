import { Suspense, useContext, useEffect, useState } from "react";

import { NextRouter, useRouter } from "next/router";
import { userContext } from "supabase/user_context";

import { Avatar, Chip, Typography, Stack, Box } from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CakeIcon from "@mui/icons-material/Cake";

import Navbar from "@/components/admin/AdminNavbar";
import Loading from "@/components/public/Loading";

import { User } from "@/types/User";
import { PAGE_PATHS } from "enum/PAGES";
import { GENDER } from "enum/GENDER";
import { Service } from "@/services";
import AdminVerifyDialog from "@/components/admin/AdminVerifyDialog";
import VerifyChip from "@/components/profile/VerifyChip";
import CommonButton from "@/components/public/CommonButton";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";

// style
const profile_layout = {
  width: "30vw",
  minWidth: "200px",
};
const avatar = { width: 200, height: 200 };

export default function AdminProfile() {
  const supabaseClient = useSupabaseClient<Database>();
  const service = new Service(supabaseClient);
  const router: NextRouter = useRouter();
  const userStatus = useContext(userContext);

  const [targetUserData, setTargetUserData] = useState<User | null>(null);

  const [isVerifyModalShow, setIsVerifyModalShow] = useState<boolean>(false);

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

  useEffect(() => {
    if (!userStatus.user || !router.query.user_id || targetUserData) return;

    service.user
      .GetUserByUserId(router.query.user_id as string)
      .then((userData) => {
        setTargetUserData(userData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [router.query.user_id, userStatus.user, targetUserData]);

  function openVerifyModal(): void {
    setIsVerifyModalShow(true);
  }
  function closeVerifyModal(): void {
    setIsVerifyModalShow(false);
  }

  if (userStatus.isLoading) return <Loading />;
  if (!userStatus.user) {
    router.push(PAGE_PATHS.LOGIN);
    return;
  }
  if (!userStatus.user.isAdmin) {
    router.push(PAGE_PATHS.HOME);
    return;
  }
  if (!targetUserData) return <Loading />;
  if (targetUserData.isAdmin) {
    router.push(PAGE_PATHS.ADMIN_HOME + userStatus.user.userId);
    return;
  }
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
          <Typography variant="body2" align="center" sx={profile_layout}>
            {targetUserData.email}
          </Typography>
          <Avatar sx={avatar} alt="Profile picture" src={targetUserData.image as string} />

          {targetUserData.isVerified && <VerifyChip />}
          <Stack direction="row" spacing={1}>
            <Chip icon={displayGenderIcon(targetUserData.sex)} label={targetUserData.sex} />
            <Chip icon={<CakeIcon />} label={targetUserData.birthdate} />
          </Stack>

          {targetUserData.description.split("\n").map((row) => (
            <Typography
              variant="body1"
              sx={{ ...profile_layout, wordBreak: "break-word", textAlign: "center" }}
              key={row}
            >
              {row}
            </Typography>
          ))}
          {!targetUserData.isVerified && (
            <>
              <Box style={{ paddingTop: "5vh" }}>
                <CommonButton label="Verify" onClick={openVerifyModal} />
              </Box>
              <AdminVerifyDialog
                openModal={isVerifyModalShow}
                handleCloseModal={closeVerifyModal}
              />
            </>
          )}
        </Stack>
      </Suspense>
    </>
  );
}
