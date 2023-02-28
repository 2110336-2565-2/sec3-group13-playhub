import Image from "next/image";
import BorderWithShadow from "../public/BorderWithShadow";

import AddParticipant from "./AddParticipant";
import React, { Fragment } from "react";

import { AppointmentDetail } from "@/types/Appointment";
import { CardContent, Card, Grid, Stack, Typography, Box, Chip, Button } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TagComponent from "../public/TagComponent";
import { useEffect, useState, useContext, ChangeEvent } from "react";
import { Dayjs } from "dayjs";
import Loading from "../public/Loading";
import { useRouter } from "next/router";

import { userContext } from "supabase/user_context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { PagePaths } from "enum/pages";
import { User } from "@/types/User";

const chipsStyle = {
  minWidth: 100,
  height: 40,
  fontSize: 18,
  fontWeight: "bold",
  border: "black solid 4px",
  borderRadius: "16px",
  boxShadow: "4px 4px #BFBFBF",
};
const textboxShadow = {
  border: "solid 4px",
  borderRadius: "16px",
  boxShadow: "8px 8px #BFBFBF",
};
const textinBox = {
  display: "inline-flex",
  height: "50px",
  alignItems: "center",
  paddingLeft: "8px",
};

type props = {
  rightSideData: AppointmentDetail;
};
export default function RightCard(props: props) {
  const router = useRouter();
  const userStatus = useContext(userContext);
  const supabaseClient = useSupabaseClient<Database>();

  const [participant, setParticipant] = useState<User[]>(props.rightSideData.acceptParticipants);
  const participantError: boolean = participant.length === 0;
  const [avaliableParticipant, setAvaliableParticipant] = useState<User[]>(
    props.rightSideData.pendingParticipants
  );

  function handleparticipant(newComer: User[]): void {
    setParticipant(newComer);
    //setIsSubmitTags(false);
  }

  useEffect(() => {
    setAvaliableParticipant(props.rightSideData.acceptParticipants);
  });

  if (userStatus.isLoading) return <Loading />;
  if (!userStatus.user) {
    router.push(PagePaths.login);
    return;
  }
  if (userStatus.user.isAdmin) {
    router.push(PagePaths.adminHome + userStatus.user.userId);
    return;
  }
  if (userStatus.isLoading) return <Loading />;

  return (
    <>
      <BorderWithShadow>
        <CardContent>
          <Stack spacing="12px" sx={{ padding: "20px", height: "100%" }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>
                Image
              </Typography>
              <Grid container spacing={1}>
                {props.rightSideData.images.map((e, index) => (
                  <Grid item key={"i" + index}>
                    <Image src={e} alt="location" width={150} height={150} />
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box>
              <AddParticipant
                header="Select Participants"
                note="(เลือกอย่างน้อย 1 คน)"
                value={participant}
                handleValueChange={handleparticipant}
                menuValue={avaliableParticipant}
                isErr={participantError}
                errMsg="(เลือกอย่างน้อย 1 คน)"
              />
            </Box>
          </Stack>
        </CardContent>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Button
            variant="contained"
            style={{ position: "absolute", bottom: 0 }} /*onClick={handleSubmit}*/
          >
            Create
          </Button>
        </Box>
      </BorderWithShadow>
    </>
  );
}
