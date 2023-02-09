import React from "react";
import Navbar from "@/components/public/Navbar";
import {
  Grid,
  Typography,
  TextField,
  Button,
  FormHelperText,
  Stack,
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import PictureList from "@/components/createPost/pictureList";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const createPost = () => {
  const error = "#ff0000";
  const createPostContainer = {
    width: "50vw",
    margin: "3vh 0 0 0",
  };
  const helperTextBox = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
  };
  const helperTextError = {
    textAlign: "start",
    gridColumn: 1,
    color: error,
    display: "none",
  };
  const helperText = {
    textAlign: "end",
    gridColumn: 2,
  };
  const createPostBtn = {
    backgroundColor: "#ffa31a",
    color: "black",
  };
  const fontDesign = {
    fontfamily: "Roboto",
    fontstyle: "normal",
    fontweight: "700",
    fontsize: "20px",
    lineheight: "24px",
    letterspacing: "0.15px",
    color: "#000000",
  };

  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = React.useState<Dayjs | null>();

  const handleStartDate = (newValue: Dayjs | null) => {
    if (newValue && newValue.isBefore(dayjs())) {
      console.error("Start date must be in the future.");
    } else {
      setStartDate(newValue);
    }
  };
  const handleEndDate = (newValue: Dayjs | null) => {
    if (newValue && newValue.isBefore(startDate)) {
      console.error("End date cannot be before Start Date.");
    } else {
      setEndDate(newValue);
    }
  };

  const Location = ["Poseidon entertainment complex", "Jod Fair"];
  const Tags = ["RPG", "Car", "CO-OP"];

  return (
    <>
      <Navbar />
      <Grid
        container
        direction="column"
        spacing={2}
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "20vh" }}
        margin="2vh 0 0 0"
      >
        <Grid item>
          <Typography variant="h1" component="h2">
            Create post
          </Typography>
        </Grid>
        <div style={createPostContainer}>
          <Grid item>
            <Typography variant="h5">Title</Typography>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              placeholder="เช่น หาเพื่อนไปเที่ยวบอร์ดเกม"
            />
            <div style={helperTextBox}>
              <FormHelperText sx={helperTextError}>
                ช่องนี้ไม่สามารถเว้นว่างได้
              </FormHelperText>
              <FormHelperText sx={helperText}>0/100</FormHelperText>
            </div>
          </Grid>
          <Grid item>
            <Typography variant="h5">Location</Typography>
            <Stack spacing={2}>
              <Autocomplete
                id="free-solo-demo"
                freeSolo
                options={Location.map((option) => option)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="เลือกสถานที่"
                    // Below is for location icon but when i show icon, It can't select location.
                    /*InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon />
                        </InputAdornment>
                      ),
                    }}*/
                  />
                )}
              />
            </Stack>
            <div style={helperTextBox}>
              <FormHelperText sx={helperTextError}>
                ช่องนี้ไม่สามารถเว้นว่างได้
              </FormHelperText>
              <FormHelperText sx={helperText}>0/100</FormHelperText>
            </div>
          </Grid>
          <Grid item>
            <Typography variant="h5">Date time</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body1">Start</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDateTimePicker
                    inputFormat="DD/MM/YYYY hh:mm a"
                    mask="__/__/____ __:__ _M"
                    value={startDate}
                    onChange={handleStartDate}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarTodayIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </LocalizationProvider>
                <div style={helperTextBox}>
                  <FormHelperText sx={helperTextError}>
                    ช่องนี้ไม่สามารถเว้นว่างได้
                  </FormHelperText>
                </div>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">End</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDateTimePicker
                    inputFormat="DD/MM/YYYY hh:mm a"
                    mask="__/__/____ __:__ _M"
                    value={endDate}
                    onChange={handleEndDate}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarTodayIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </LocalizationProvider>
                <div style={helperTextBox}>
                  <FormHelperText sx={helperTextError}>
                    ช่องนี้ไม่สามารถเว้นว่างได้
                  </FormHelperText>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="h5">Tag</Typography>
            <Autocomplete
              multiple
              limitTags={5}
              id="multiple-limit-tags"
              options={Tags}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Click for add tag"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item>
            <Typography variant="h5">Description</Typography>
            <TextField
              variant="outlined"
              fullWidth
              size="medium"
              placeholder="เช่น มาเที่ยวกันเลย ร้านบอร์ดเกมแถวรัชดา"
            />
            <div style={helperTextBox}>
              <FormHelperText sx={helperTextError}>
                ช่องนี้ไม่สามารถเว้นว่างได้
              </FormHelperText>
              <FormHelperText sx={helperText}>0/500</FormHelperText>
            </div>
          </Grid>
          <Grid item>
            <Typography variant="h5">Image(Optional)</Typography>
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
              spacing={1}
            >
              <PictureList />
            </Stack>
          </Grid>
        </div>
        <Grid item>
          <Button variant="contained" sx={createPostBtn}>
            <Typography style={fontDesign}>Create Post</Typography>
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default createPost;
