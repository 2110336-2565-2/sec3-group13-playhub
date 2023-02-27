import { AppointmentDetailHeader } from "@/types/Appointment";
import { CardContent, Card, Grid, Stack, Typography, Box, Chip } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const textboxShadow = {
  border: "solid 4px",
  borderRadius: "16px",
  boxShadow: "8px 8px #BFBFBF",
};
const textinBox = {
  display: "inline-flex",
  height: '50px',
  alignItems: 'center',
  paddingLeft: '8px'
}
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
  detailHeader: AppointmentDetailHeader,
  isHost: boolean
};
export default function AppointmentHeader(props: props) {
  return <>
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>Title</Typography>
      <Card sx={{ ...textboxShadow, bgcolor: props.isHost ? '#9797971A' : null }}>
        <Typography variant='h6' sx={textinBox}>{props.detailHeader.title}</Typography>
      </Card>
    </Box>
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>Location</Typography>
      <Card sx={{ ...textboxShadow, bgcolor: props.isHost ? '#9797971A' : null }}>
        <Typography variant='h6' sx={textinBox}>
          <LocationOnIcon fontSize="large" />
          <span style={{ marginLeft: '16px' }}>{props.detailHeader.location}</span>
        </Typography>
      </Card>
    </Box>
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>Date & Time</Typography>
      <Card sx={{ ...textboxShadow, bgcolor: props.isHost ? '#9797971A' : null }}>
        <Typography variant='h6' sx={textinBox}>
          <CalendarTodayIcon fontSize="large" />
          <span style={{ marginLeft: '16px' }}>{props.detailHeader.startDateTime.format('DD/MM/YYYY HH:mm A')}</span>
        </Typography>
      </Card>
    </Box>
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>Tag</Typography>
      <Grid container spacing={1}>
        {props.detailHeader.tags.map((e, index) => (
          <Grid item key={'t' + index}>
            <Chip
              label={e}
              variant="outlined"
              color='primary'
              style={{ ...chipsStyle, backgroundColor: props.isHost ? '#9797971A' : undefined }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>Description</Typography>
      <Card sx={{ ...textboxShadow, bgcolor: props.isHost ? '#9797971A' : null }}>
        <Typography variant='h6' sx={{ ...textinBox, display: null, padding: '8px', height: '200px', whiteSpace: "pre-line" }}>
          {props.detailHeader.description}
        </Typography>
      </Card>
    </Box>
  </>
}