import { AppointmentDetail } from "@/types/Appointment";
import { CardContent, Grid, Stack, Typography, Box, Chip } from "@mui/material";
import Image from "next/image";
import BorderWithShadow from "../public/BorderWithShadow";
import TagComponent from "../public/TagComponent";
import AppointmentHeader from "./AppointmentHeader";
import AddParticipant from "./AddParticipant";
const chipsStyle = {
  minWidth: 100,
  height: 40,
  fontSize: 18,
  fontWeight: 'bold',
  border: "black solid 4px",
  borderRadius: "16px",
  boxShadow: "4px 4px #BFBFBF",
}
type props = {
  appointmentDetail: AppointmentDetail,
};
export default function AppointmentHostCard(props: props) {
  return <Grid container
    spacing="40px"
    width="80vw"
  >
    <Grid item xs={12} md={6} style={{ display: "flex" }}>
      <BorderWithShadow>
        <CardContent>
          <Stack spacing="12px" sx={{ padding: "20px", height: "100%" }}>
            <AppointmentHeader detailHeader={props.appointmentDetail.detailHeader} isHost={true} />

          </Stack>
        </CardContent>
      </BorderWithShadow>
    </Grid>
    <Grid item xs={12} md={6} style={{ display: "flex" }} >
      <BorderWithShadow>
        <CardContent >
          <Stack spacing="12px" sx={{ padding: "20px", height: "100%" }}>
            <Box >
              <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>Image</Typography>
              <Grid container spacing={1}>
                {props.appointmentDetail.images.map((e, index) => (
                  <Grid item key={'i' + index}>
                    <Image src={e} alt="location" width={150} height={150} />
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box >
              <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>Select Participants :</Typography>
              <Grid container spacing={1}>
                {props.appointmentDetail.pendingParticipants.map((e, index) => (
                  <Grid item key={'p' + index}>
                    {/*<AddParticipant></AddParticipant>*/}
                  </Grid>
                ))}
              </Grid>
            </Box>

          </Stack>
        </CardContent>
      </BorderWithShadow>
    </Grid>
  </Grid>
}