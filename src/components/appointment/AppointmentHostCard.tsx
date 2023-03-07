import { AppointmentDetail } from "@/types/Appointment";
import { CardContent, Grid, Stack, Typography, Box, Chip } from "@mui/material";
import Image from "next/image";
import BorderWithShadow from "../public/BorderWithShadow";
import AppointmentHeader from "./AppointmentHeader";

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
            {props.appointmentDetail.images.length > 0 &&
              (<Box >
                <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>Image</Typography>
                <Grid container spacing={1}>
                  {props.appointmentDetail.images.map((e, index) => (
                    <Grid item key={'i' + index}>
                      <Image src={e} alt="Appointment_Image" width={140} height={140} />
                    </Grid>
                  ))}
                </Grid>
              </Box>)}
          </Stack>
        </CardContent>
      </BorderWithShadow>
    </Grid>
    <Grid item xs={12} md={6} style={{ display: "flex" }} >
      <BorderWithShadow>
        <CardContent >
          <Stack spacing="12px" sx={{ padding: "20px", height: "100%" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>Number of Participant : {props.appointmentDetail.participantAmount}</Typography>
            <Box >
              <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>Pending Participant List :</Typography>
              <Grid container spacing={1}>
                {props.appointmentDetail.pendingParticipants.map((e, index) => (
                  <Grid item key={'p' + index}>
                    <Chip
                      label={e}
                      variant="outlined"
                      color='primary'
                      style={{ ...chipsStyle, backgroundColor: '#9797971A' }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Box >
              <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>Accept Participant List :</Typography>
              <Grid container spacing={1}>
                {props.appointmentDetail.acceptParticipants.map((e, index) => (
                  <Grid item key={'a' + index}>
                    <Chip
                      label={e}
                      variant="outlined"
                      color="success"
                      style={{ ...chipsStyle, backgroundColor: '#42FF001A' }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Box >
              <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>Reject Participant List :</Typography>
              <Grid container spacing={1}>
                {props.appointmentDetail.rejectParticipants.map((e, index) => (
                  <Grid item key={'r' + index}>
                    <Chip
                      label={e}
                      variant="outlined"
                      color='error'
                      style={{ ...chipsStyle, backgroundColor: '#FF00001A' }}
                    />
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