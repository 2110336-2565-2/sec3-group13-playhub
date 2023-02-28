import { Suspense, useContext, useEffect, useState } from "react";

import { NextRouter, useRouter } from "next/router";
import { userContext } from "supabase/user_context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";

import { Avatar, Chip, Typography, Stack, Button, Box, TextField, FormHelperText } from "@mui/material";
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
import { validateNationalIDCardNumber } from "@/utilities/validation";
import { validation } from "@/types/Validation";
import VerifyChip from "@/components/profile/VerifyChip";

// style
const profile_layout = {
  width: "30vw",
  minWidth: "200px",
};
const avatar = { width: 200, height: 200 };
const helperText = {
  display: "flex",
  flexDirection: "row-reverse",
  justifyContent: "space-between",
  marginTop: "10px"
};

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

    UpdateUserNationalIdByUserId(router.query.user_id as string, nationalIDCard, supabaseClient)
      .then((is_national_id_exist) => {
        if (is_national_id_exist) {
          setIsError(true);
          setErrMsg("เลขบัตรประจำตัวประชาชนนี้ถูกใช้งานไปแล้ว");
          return;
        }
        router.reload()
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
    if (event.target.value.length > CHAR_LIMIT.MAX_NATIONAL_ID_CARD_NUMBER) return
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
          <Typography variant="body2" align="center" sx={profile_layout}>
            {targetUserData.email}
          </Typography>
          <Avatar sx={avatar} alt="Profile picture" src={targetUserData.image as string} />

          {targetUserData.isVerified &&
            <VerifyChip />
          }
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
          {!targetUserData.isVerified &&
            <Button style={{ marginTop: "50px" }} onClick={openVerifyModal} variant="contained">
              Verify
            </Button>
          }
          <AdminVerifyDialog
            openModal={isVerifyModalShow}
            handleCloseModal={closeVerifyModal}
            verifyUser={verifyUser}
            nationalID={nationalIDCard}
          >
            <Box sx={{ width: "70%", margin: "auto" }}>
              <TextField
                placeholder="เลขโดด 13 หลักเท่านั้น"
                error={isError || nationalIDCard.length > CHAR_LIMIT.MAX_NATIONAL_ID_CARD_NUMBER}
                value={nationalIDCard}
                onChange={handleNationalIDCardChange}
                fullWidth
                inputProps={{
                  sx: {
                    textAlign: "center",
                    "&::placeholder": {
                      textAlign: "center",
                    },
                  },
                }}
              />
              <Box sx={helperText}>
                <FormHelperText>
                  {`${nationalIDCard.length}/${CHAR_LIMIT.MAX_NATIONAL_ID_CARD_NUMBER}`}
                </FormHelperText>
                {isError && <FormHelperText error>{errMsg}</FormHelperText>}
              </Box>
            </Box>
          </AdminVerifyDialog>
        </Stack>
      </Suspense>
    </>
  );
}
