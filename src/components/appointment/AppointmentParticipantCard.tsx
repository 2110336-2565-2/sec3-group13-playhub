import { AppointmentDetail, AppointmentDetailHeader } from "@/types/Appointment";
import { CardContent, Card, Grid, Stack, Typography, Box, Chip } from "@mui/material";
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
  title: "dadadad",
  location: "tiananmen square",
  startDateTime: "15/4/1989",
  endDateTime: "4/6/1989",
  tags: ["WOH", "WARHAMMER", "afafafafafa", "adadadadad", "adadadadad"],
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
export default function AppointmentParticipantCard() {
  return <Grid container
    spacing="40px"
    width="80vw"
  >
    <Grid item xs={12} md={6} style={{ display: "flex", flexGrow: 1, flexBasis: 0 }}>
      <BorderWithShadow>
        <CardContent>
          <Stack spacing="12px" sx={{ padding: "20px" }}>
            <AppointmentHeader detailHeader={mockHeader} isHost={false} />
          </Stack>
        </CardContent>
      </BorderWithShadow>
    </Grid>
    <Grid item xs={12} md={6} style={{ display: "flex", flexGrow: 1, flexBasis: 0 }} >
      <BorderWithShadow>
        <CardContent >
          <Stack spacing="12px" sx={{ padding: "20px" }}>
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
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>Number of Participant : {mockData.participantAmount}</Typography>
            <Box >
              <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>Participant List :</Typography>
              <Grid container spacing={1}>
                {mockData.acceptParticipants.map((e, index) => (
                  <Grid item key={'p' + index}>
                    <Chip
                      label={e}
                      variant="outlined"
                      color='primary'
                      style={chipsStyle}
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