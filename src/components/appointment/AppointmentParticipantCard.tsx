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
export default function AppointmentParticipantCard(props: props) {
  return <Grid container
    spacing="40px"
    width="80vw"
  >
    <Grid item xs={12} md={6} style={{ display: "flex" }}>
      <BorderWithShadow>
        <CardContent>
          <Stack spacing="12px" sx={{ padding: "20px" }}>
            <AppointmentHeader detailHeader={props.appointmentDetail.detailHeader} isHost={false} />
          </Stack>
        </CardContent>
      </BorderWithShadow>
    </Grid>
    <Grid item xs={12} md={6} style={{ display: "flex" }} >
      <BorderWithShadow>
        <CardContent>
          <Stack spacing="12px" sx={{ padding: "20px" }}>
            {props.appointmentDetail.images.length > 0 &&
              (<Box >
                <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>Image</Typography>
                <Grid container spacing={1}>
                  {props.appointmentDetail.images.map((e, index) => (
                    <Grid item key={'i' + index}>
                      <Image src={e} alt="Appointment_Image" width={150} height={150} />
                    </Grid>
                  ))}
                </Grid>
              </Box>)}
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>Number of Participant : {props.appointmentDetail.participantAmount}</Typography>
            <Box >
              <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>Participant List :</Typography>
              <Grid container spacing={1}>
                {props.appointmentDetail.acceptParticipants.map((e, index) => (
                  <Grid item key={'p' + index}>
                    {index == 0 && (
                      <Chip
                        label={e}
                        variant="outlined"
                        color='primary'
                        style={{ ...chipsStyle, backgroundColor: '#FFA31A40' }}
                      />
                    )}
                    {index != 0 && (
                      <Chip
                        label={e}
                        variant="outlined"
                        color='primary'
                        style={chipsStyle}
                      />
                    )}
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