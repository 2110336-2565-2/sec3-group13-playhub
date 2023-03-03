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

export default function RightCard(props: props) {
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
                {props.images.map((e, index) => (
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
                value={props.selectedParticipants}
                handleValueChange={props.handleParticipantsChange}
                menuValue={props.availableParticipants}
                isErr={props.participantCountError}
                errMsg="(เลือกอย่างน้อย 1 คน)"
              />
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Button
                variant="contained"
                style={{ position: "absolute", bottom: 0 }}
                onClick={props.onSubmit}
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
