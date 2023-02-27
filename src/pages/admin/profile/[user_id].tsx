import { Suspense, useContext, useEffect, useState } from "react";

import { NextRouter, useRouter } from "next/router";

import { userContext } from "supabase/user_context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";

import { Avatar, Chip, Typography, Stack, Button, Box } from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import CakeIcon from "@mui/icons-material/Cake";

import Navbar from "@/components/admin/AdminNavbar";
import Loading from "@/components/public/Loading";

import { User } from "@/types/User";
import { PagePaths } from "enum/pages";
import { Gender } from "enum/gender";
import { CHAR_LIMIT } from "enum/inputLimit";
import { GetUserByUserId, UpdateUserNationalIdByUserId } from "@/services/User";
import AdminVerifyDialog from "@/components/admin/AdminVerifyDialog";
import CommonTextField from "@/components/public/CommonTextField";
import { validateNationalIDCardNumber } from "@/utilities/validation";
import { validation } from "@/types/Validation";

// style
const profile_layout = {
  width: "30vw",
  minWidth: "200px",
};
const avatar = { width: 200, height: 200 };

export default function adminProfile() {
  const router: NextRouter = useRouter();
  const userStatus = useContext(userContext);
  const supabaseClient = useSupabaseClient<Database>();

  const [targetUserData, setTargetUserData] = useState<User | null>(null);
  const [nationalIDCard, setnationalIDCard] = useState<string>("");

  const [isVerifyModalShow, setIsVerifyModalShow] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");

  useEffect(() => {
    async function getTargetUserData() {
      if (!userStatus.user || !router.query.user_id || targetUserData) return;
      const userData = await GetUserByUserId(router.query.user_id as string, supabaseClient);
      setTargetUserData(userData);
    }

    getTargetUserData();
  }, [router.query.user_id, supabaseClient, userStatus.user, targetUserData]);

  function verifyUser(): void {
    console.log("confirm button is clicked!!", nationalIDCard);

    const validate: validation = validateNationalIDCardNumber(nationalIDCard);
    if (validate.err) {
      setIsError(true);
      setErrMsg(validate.msg);
      return;
    }

    // Frontend Validate success
    // Send to Backend
    // USE: nationalIDCard

    // CASE: เลขบัตรประจำตัวประชาชนนี้ถูกใช้งานไปแล้ว
    // setIsError(true)
    // setErrMsg("เลขบัตรประจำตัวประชาชนนี้ถูกใช้งานไปแล้ว")
    // return
    UpdateUserNationalIdByUserId(router.query.user_id as string, nationalIDCard, supabaseClient)
      .then((is_national_id_exist) => {
        console.log(is_national_id_exist);
        if (is_national_id_exist) {
          setIsError(true);
          setErrMsg("เลขบัตรประจำตัวประชาชนนี้ถูกใช้งานไปแล้ว");
          return;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function openVerifyModal(): void {
    setIsVerifyModalShow(true);
    setIsError(false);
    setErrMsg("");
    setnationalIDCard("");
  }
  function closeVerifyModal(): void {
    setIsVerifyModalShow(false);
    setnationalIDCard("");
  }
  function handleNationalIDCardChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    setnationalIDCard(event.target.value);
    setIsError(false);
    setErrMsg("");
  }

  if (userStatus.isLoading) return <Loading />;
  if (!userStatus.user) {
    router.push(PagePaths.login);
    return;
  }
  if (!userStatus.user.isAdmin) {
    router.push(PagePaths.home);
    return;
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
          {router.query.user_id === userStatus.user.userId && (
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
          <Button style={{ marginTop: "50px" }} onClick={openVerifyModal} variant="contained">
            Verify
          </Button>
          <AdminVerifyDialog
            openModal={isVerifyModalShow}
            handleCloseModal={closeVerifyModal}
            verifyUser={verifyUser}
          >
            <Box sx={{ width: "70%", margin: "auto" }}>
              <CommonTextField
                placeholder="เลขโดด 13 หลักเท่านั้น"
                value={nationalIDCard}
                handleValueChange={handleNationalIDCardChange}
                isErr={isError}
                errMsg={errMsg}
                char_limit={CHAR_LIMIT.MAX_NATIONAL_ID_CARD_NUMBER}
              />
            </Box>
          </AdminVerifyDialog>
        </Stack>
      </Suspense>
    </>
  );
}