import { AppointmentDetailHeader } from "@/types/Appointment";
import { Card, Grid, Typography, Box, Chip } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const textinBox = {
  display: "inline-flex",
  height: '50px',
  alignItems: 'center',
  paddingLeft: '8px',
  fontSize: "18px"
}
const chipsStyle = {
  minWidth: 100,
  height: 40,
  fontSize: 18,
  fontWeight: 'bold',
  border: "black solid 4px",
  borderRadius: "16px",
}
type props = {
  detailHeader: AppointmentDetailHeader,
  isHost: boolean
};
export default function AppointmentHeader(props: props) {
  return <>
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>Title</Typography>
      <Card sx={{ width: "100%", bgcolor: props.isHost ? '#9797971A' : null }}>
        <Typography variant='body1' sx={textinBox}>{props.detailHeader.title}</Typography>
      </Card>
    </Box>
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>Location</Typography>
      <Card sx={{ bgcolor: props.isHost ? '#9797971A' : null }}>
        <Typography variant='body1' sx={textinBox}>
          <LocationOnIcon fontSize="large" />
          <span style={{ marginLeft: '8px' }}>{props.detailHeader.location}</span>
        </Typography>
      </Card>
    </Box>
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>Date & Time</Typography>
      <Card sx={{ width: "100%", bgcolor: props.isHost ? '#9797971A' : null }}>
        <Typography variant='body1' sx={textinBox}>
          <CalendarTodayIcon fontSize="large" />
          <span style={{ marginLeft: '8px' }}>{props.detailHeader.startDateTime.format('DD/MM/YYYY HH:mm A')} - {props.detailHeader.endDateTime.format('DD/MM/YYYY HH:mm A')}</span>
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
      <Card sx={{ bgcolor: props.isHost ? '#9797971A' : null }}>
        <Typography variant='body1' sx={{ ...textinBox, display: null, padding: '8px', height: '200px', whiteSpace: "pre-line" }}>
          {props.detailHeader.description}
        </Typography>
      </Card>
    </Box>
  </>
}