import Image from "next/image";
import BorderWithShadow from "../public/BorderWithShadow";

import AddParticipant from "./AddParticipant";
import React, { Fragment } from "react";

import { AppointmentDetail } from "@/types/Appointment";
import { CardContent, Card, Grid, Stack, Typography, Box, Chip, Button } from "@mui/material";

import { useEffect, useState, useContext, ChangeEvent } from "react";

import Loading from "../public/Loading";
import { useRouter } from "next/router";

import { userContext } from "supabase/user_context";

import { PagePaths } from "enum/pages";
import { User } from "@/types/User";

type props = {
  rightSideData: AppointmentDetail;
  /*sendParticipant: User[];
  sendIsSubmit: Boolean;*/
};
export default function RightCard(props: props) {
  const router = useRouter();
  const userStatus = useContext(userContext);

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
    return null;
  }
  if (userStatus.user.isAdmin) {
    router.push(PagePaths.adminHome + userStatus.user.userId);
    return null;
  }
  if (userStatus.isLoading) return <Loading />;

  function handleSubmit() {
    if (!participantError) {
      /*
      ??? Please do this ???
      check participant first  then send submittatus(isSubmit) and participant to [createAppointment].tsx
      
      */
    }
  }

  return (
    <>
      <BorderWithShadow>
        <CardContent>
          <Stack
            spacing="12px"
            sx={{ padding: "20px", height: "100%" }}
            style={{ position: "relative" }}
          >
            {/* Image  */}
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
            {/* AddParticipant */}
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
            <Box display="flex" justifyContent="center" alignItems="center">
              <Button
                variant="contained"
                style={{ position: "absolute", bottom: 0 }}
                onClick={handleSubmit}
              >
                Create
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </BorderWithShadow>
    </>
  );
}
