import { AppointmentDetailHeader } from "@/types/Appointment";
import { Grid, Typography, Box, Chip } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TextField from "@mui/material/TextField";

const textBox = {
  border: "solid 4px",
  borderRadius: "16px",
  boxShadow: "8px 8px 1px #BFBFBF",
  "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" },
};
const chipsStyle = {
  minWidth: 100,
  height: 40,
  fontSize: 18,
  fontWeight: "bold",
  border: "black solid 4px",
  borderRadius: "16px",
};
type props = {
  detailHeader: AppointmentDetailHeader;
  isHost: boolean;
};
export default function AppointmentHeader(props: props) {
  return (
    <>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>
          Title
        </Typography>
        <TextField
          disabled
          value={props.detailHeader.title}
          sx={{
            ...textBox,
            bgcolor: props.isHost ? "#9797971A" : null,
            width: "100%",
          }}
          InputProps={{ style: { fontSize: "18px" } }}
        />
      </Box>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>
          Location
        </Typography>
        <TextField
          disabled
          multiline
          value={props.detailHeader.location}
          sx={{
            ...textBox,
            bgcolor: props.isHost ? "#9797971A" : null,
            width: "100%",
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon fontSize="large" />
              </InputAdornment>
            ),
            style: { fontSize: "18px", paddingLeft: "8px" },
          }}
        />
      </Box>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>
          Date & Time
        </Typography>
        <TextField
          disabled
          value={`${props.detailHeader.startDateTime.format(
            "DD/MM/YYYY HH:mm A"
          )} - ${props.detailHeader.endDateTime.format("DD/MM/YYYY HH:mm A")}`}
          sx={{
            ...textBox,
            bgcolor: props.isHost ? "#9797971A" : null,
            width: "100%",
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarTodayIcon fontSize="large" />
              </InputAdornment>
            ),
            style: { fontSize: "18px", paddingLeft: "8px" },
          }}
        />
      </Box>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>
          Tag
        </Typography>
        <Grid container spacing={1}>
          {props.detailHeader.tags.map((e, index) => (
            <Grid item key={"t" + index}>
              <Chip
                label={e}
                variant="outlined"
                color="primary"
                style={{ ...chipsStyle, backgroundColor: props.isHost ? "#9797971A" : undefined }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>
          Description
        </Typography>
        <TextField
          disabled
          multiline
          value={props.detailHeader.description}
          rows={8}
          sx={{
            ...textBox,
            bgcolor: props.isHost ? "#9797971A" : null,
            width: "100%",
          }}
          InputProps={{ style: { fontSize: "18px", padding: "8px", whiteSpace: "pre-line" } }}
        />
      </Box>
    </>
  );
}
