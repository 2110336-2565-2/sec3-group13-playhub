import { AppointmentDetail, AppointmentDetailHeader } from "@/types/Appointment";
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
const mockHeader: AppointmentDetailHeader = {
  title: "adadadad",
  location: "tiananmen square",
  startDateTime: "15/4/1989",
  endDateTime: "4/6/1989",
  tags: ["WARHAMMER", "THEPOOH", "GAMEOFTHRONES"],
  description: "sasaoslasoals"
}
const mockData: AppointmentDetail = {
  detailHeader: mockHeader,
  images: ['https://yhvwtxoqpasglonyjmpe.supabase.co/storage/v1/object/public/locationimage/7f6184d2-91dc-478e-911b-e18b7e17cec901676866401794', 'https://yhvwtxoqpasglonyjmpe.supabase.co/storage/v1/object/public/locationimage/7f6184d2-91dc-478e-911b-e18b7e17cec901676866401794'],
  participantAmount: 10,
  pendingParticipants: ["Participant1", "Participant2", "Participant3"],
  acceptParticipants: ["Participant1", "Participant2", "Participant3", "Participant1", "Participant2", "Participant3"],
  rejectParticipants: ["Participant1", "Participant2", "Participant3"]
}
export default function AppointmentHostCard() {
  return <Grid container
    spacing="40px"
    width="80vw"
  >
    <Grid item xs={12} md={6} style={{ display: "flex" }}>
      <BorderWithShadow>
        <CardContent>
          <Stack spacing="12px" sx={{ padding: "20px" }}>
            <AppointmentHeader detailHeader={mockHeader} isHost={true} />
            <Box >
              <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>Image</Typography>
              <Grid container spacing={1}>
                {mockData.images.map((e, index) => (
                  <Grid item key={'i' + index}>
                    <Image src={e} alt="location" width={150} height={150} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Stack>
        </CardContent>
      </BorderWithShadow>
    </Grid>
    <Grid item xs={12} md={6} style={{ display: "flex" }} >
      <BorderWithShadow>
        <CardContent >
          <Stack spacing="12px" sx={{ padding: "20px" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>Number of Participant : {mockData.participantAmount}</Typography>
            <Box >
              <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>Pending Participant List :</Typography>
              <Grid container spacing={1}>
                {mockData.pendingParticipants.map((e, index) => (
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
                {mockData.acceptParticipants.map((e, index) => (
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
                {mockData.rejectParticipants.map((e, index) => (
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