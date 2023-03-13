import Image from "next/image";
import BorderWithShadow from "../public/BorderWithShadow";
import AddParticipant from "./AddParticipant";
import { CardContent, Grid, Stack, Typography, Box, Button } from "@mui/material";
import { User } from "@/types/User";

type props = {
  images: string[];
  availableParticipants: User[];
  selectedParticipants: User[];
  onSubmit: () => void;
  participantCountError: boolean;
  // eslint-disable-next-line no-unused-vars
  handleParticipantsChange: (participants: User[]) => void;
};

export default function PostInfoCard(props: props) {
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
              {props.images.length != 0 && (
                <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>
                  Image
                </Typography>
              )}
              <Grid container spacing={1}>
                {props.images.map((e, index) => (
                  <Grid item key={"i" + index}>
                    <Image src={e} alt="location" width={150} height={150} />
                  </Grid>
                ))}
              </Grid>
            </Box>
            {/* AddParticipant */}
            <Box>
              <Box display="flex" flexDirection="column">
                <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>
                  Select Participants
                  {"\u00A0"}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: "grey" }}>
                  (เลือกอย่างน้อย 1 คน)
                </Typography>
              </Box>
              {props.availableParticipants.length == 0 ? (
                <Box display="flex">
                  {props.availableParticipants.length == 0 && (
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", marginBottom: "4px", color: "red" }}
                    >
                      ยังไม่มีผู้สนใจกิจกรรมนี้
                    </Typography>
                  )}
                </Box>
              ) : (
                <AddParticipant
                  //header="Select Participants"
                  //note="(เลือกอย่างน้อย 1 คน)"
                  value={props.selectedParticipants}
                  handleValueChange={props.handleParticipantsChange}
                  menuValue={props.availableParticipants}
                  isErr={props.participantCountError}
                  errMsg="(กรุณาเลือกอย่างน้อย 1 คน)"
                />
              )}
            </Box>
          </Stack>
        </CardContent>

        <Box
          sx={{ position: "relative", bottom: 50 }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {props.availableParticipants.length > 0 && (
            <Button variant="contained" onClick={props.onSubmit}>
              Create
            </Button>
          )}
        </Box>
      </BorderWithShadow>
    </>
  );
}
