import React, { useEffect } from "react";
import Navbar from "@/components/public/Navbar";
import { useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  FormHelperText,
  Stack,
  Autocomplete,
  InputAdornment,
  Chip,
  Box,
  Paper,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import PictureList from "@/components/createPost/pictureList";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GoogleMaps from "@/components/createPost/searchMaps";
import { emptyPost, Post } from "@/types/Post";
import * as design from "@/components/createPost/createPostDesign";
const createPost = () => {
  const Tags = [
    "Poseidon entertainment complex",
    "The Lord รัชดา",
    "วิคตอเรียซีเครท",
    "แคทเธอรีนเอ็นเตอร์เทนเม้นท์",
    "เอ็มมานูเอล",
    "โคปาคาบาน่า",
    "ลาเดอ ฟรองซ์",
    "โคลอนเซ่",
    "ยูโธเปีย",
    "อัมสเตอร์ดัม",
  ];
  const dummyEditFrom: Post = {
    title: "this is title",
    ownerName: "this is owner name",
    ownerProfilePic: "",
    tags: [Tags[0], Tags[1]],
    description: "this is description",
    image: [
      "https://picsum.photos/id/12/200",
      "https://picsum.photos/id/13/200",
    ],

    location: "this is location",
    startDateTime: "2022-01-01",
    endDateTime: "2022-01-02",
  };
  const initialValue: Post = true ? dummyEditFrom : emptyPost;

  const [startDate, setStartDate] = React.useState<Dayjs | null>(
    dayjs(initialValue.startDateTime === "" ? null : initialValue.startDateTime)
  );
  const [endDate, setEndDate] = React.useState<Dayjs | null>(
    initialValue.endDateTime === "" ? null : dayjs(initialValue.endDateTime)
  );
  const [selectedTags, setSelectedTags] = useState(initialValue.tags);
  const [images, setImages] = useState<string[]>([]);

  const [isTitleErr, setIsTitleErr] = React.useState(false);
  const [isLocationErr, setIsLocationErr] = React.useState(false);
  const [isStartDateErr, setIsStartDateErr] = React.useState(false);
  const [isEndDateErr, setIsEndDateErr] = React.useState(false);
  const [isTagErr, setIsTagErr] = React.useState(false);
  const [isDescErr, setIsDescErr] = React.useState(false);
  const [isImgErrsetis, setIsImgErrsetis] = React.useState(false);

  useEffect(() => {
    setImages(initialValue.image);
  }, []);

  const handleAddTag = (event: any, tag: any) => {
    if (tag.length <= 5) {
      console.log(tag.length);
      setSelectedTags(tag);
    }
  };

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

  const Location = [
    "Poseidon entertainment complex",
    "Jod Fair",
    "Fortune",
    "The street",
    "ศูนย์วัฒนธรรมแห่งประเทศไทย",
  ];

  return (
    <>
      <Navbar />
      <Stack
        spacing={2}
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
        margin="0 0 2vh 0"
      >
        <Box sx={design.createPostLayout}>
          <Typography variant="h1" component="h2">
            Create post
          </Typography>
        </Box>
        <title></title>

        <Box sx={design.createPostLayout}>
          <Typography variant="h5" margin="0 0 1vh 0">
            Location
          </Typography>
          <Stack spacing={2}>
            {/*<Autocomplete
              id="free-solo-demo"
              freeSolo
              options={Location.map((option) => option)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="พิมพ์เลือกสถานที่"
                  // Below is for location icon but when i show icon, It can't select location.
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
                />*/}
            <GoogleMaps initialValue={initialValue.location} />
          </Stack>
          <div style={design.helperTextBox}>
            <FormHelperText sx={design.helperTextError}>
              ช่องนี้ไม่สามารถเว้นว่างได้
            </FormHelperText>
          </div>
        </Box>
        <Box sx={design.createPostLayout}>
          <Typography variant="h5" margin="0 0 1vh 0">
            Date time
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1">Start</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDateTimePicker
                  inputFormat="DD/MM/YYYY hh:mm a"
                  mask="__/__/____ __:__ _M"
                  value={startDate}
                  onChange={handleStartDate}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </LocalizationProvider>
              <div style={design.helperTextBox}>
                <FormHelperText sx={design.helperTextError}>
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
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </LocalizationProvider>
              <div style={design.helperTextBox}>
                <FormHelperText sx={design.helperTextError}>
                  ช่องนี้ไม่สามารถเว้นว่างได้
                </FormHelperText>
              </div>
            </Grid>
          </Grid>
        </Box>
        <Box sx={design.createPostLayout}>
          <Typography variant="h5" margin="0 0 1vh 0">
            Tag
          </Typography>
          <Autocomplete
            multiple
            options={Tags}
            value={selectedTags}
            onChange={handleAddTag}
            renderTags={(value: readonly string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Paper
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    borderRadius: "4px",
                  }}
                >
                  <Chip
                    variant="outlined"
                    label={option}
                    style={{ color: "#6200EE", border: "none" }}
                    {...getTagProps({ index })}
                  />
                </Paper>
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="คลิกเพื่อเลือก Tags (เลือกได้สูงสุด 5 Tags)"
                fullWidth
              />
            )}
          />
        </Box>
        <Box sx={design.createPostLayout}>
          <Typography variant="h5" margin="0 0 1vh 0">
            Description
          </Typography>
          <TextField
            defaultValue={initialValue.description}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            size="medium"
            placeholder="เช่น มาเที่ยวกันเลย ร้านบอร์ดเกมแถวรัชดา"
          />
          <div style={design.helperTextBox}>
            <FormHelperText sx={design.helperTextError}>
              ช่องนี้ไม่สามารถเว้นว่างได้
            </FormHelperText>
            <FormHelperText sx={design.helperText}>0/500</FormHelperText>
          </div>
        </Box>
        <Box sx={design.createPostLayout}>
          <Typography variant="h5" margin="0 0 1vh 0">
            <span>Image </span>
            <span style={{ color: "grey" }}>
              (Optional, เลือกได้สูงสุด 3 รูป )
            </span>
          </Typography>

          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            spacing={1}
          >
            <PictureList imgs={images} stateChanger={setImages} />
          </Stack>
        </Box>
        <Box
          /*sx={createPostLayout} */ justifyContent="center"
          alignItems="center"
        >
          <Button variant="contained" color="primary">
            <Typography style={design.fontDesign}>Create Post</Typography>
          </Button>
        </Box>
      </Stack>
    </>
  );
};

export default createPost;
