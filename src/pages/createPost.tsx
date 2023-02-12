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
import * as message from "@/utilities/createPostVal";

//start function
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
    startDateTime: "2023-03-01",
    endDateTime: "2023-04-02",
  };

  const initialValue: Post = true ? dummyEditFrom : emptyPost;
  const error = "#ff0000";
  const createPostLayout = {
    width: "35vw",
    margin: "2vh 0 0 0",
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
  const fontDesign = {
    fontstyle: "normal",
    fontweight: "700",
    fontsize: "20px",
    lineheight: "24px",
    letterspacing: "0.15px",
    color: "#000000",
  };
  const [isSubmit, setIsSubmit] = React.useState(false);

  const [title, setTitle] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [startDate, setStartDate] = React.useState<Dayjs | null>(
    dayjs(initialValue.startDateTime === "" ? null : initialValue.startDateTime)
  );
  const [endDate, setEndDate] = React.useState<Dayjs | null>(
    initialValue.endDateTime === "" ? null : dayjs(initialValue.endDateTime)
  );
  const [selectedTags, setSelectedTags] = useState(initialValue.tags);
  const [desc, setDesc] = React.useState("");
  const [images, setImages] = useState<string[]>([]);

  //const [isTitleErr, setIsTitleErr] = React.useState(false);
  /*
  const [isLocationErr, setIsLocationErr] = React.useState(false);
  const [isStartDateErr, setIsStartDateErr] = React.useState(false);
  const [isEndDateErr, setIsEndDateErr] = React.useState(false);
  const [isTagErr, setIsTagErr] = React.useState(false);
  const [isDescErr, setIsDescErr] = React.useState(false);
  const [isImgErrsetis, setIsImgErrsetis] = React.useState(false);*/

  const titleErrMsg = message.checkTitle(title, 1);
  const isTitleErr = titleErrMsg !== "";

  /*const locationErrMsg = message.checkLocation(location, 1);
  const isLocationErr = locationErrMsg.length < 1;

  const startDateErrMsg = message.checkStartDate(startDate);
  const isStartDateErr = startDateErrMsg !== "";*/

  useEffect(() => {
    setImages(initialValue.image);
  }, []);
  function handleTitleChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    setTitle(event.target.value);
    setIsSubmit(false);
  }

  const handleAddTag = (event: any, tag: any) => {
    if (tag.length <= 5) {
      console.log(tag.length);
      setSelectedTags(tag);
    }
  };

  const handleStartDate = (newValue: Dayjs | null) => {
    if (newValue && newValue.isBefore(dayjs())) {
      alert("Start date must be in the future.");
    } else {
      setStartDate(newValue);
      setIsSubmit(false);
    }
  };
  const handleEndDate = (newValue: Dayjs | null) => {
    if (newValue && newValue.isBefore(startDate)) {
      console.error("End date cannot be before Start Date.");
    } else {
      setEndDate(newValue);
    }
  };
  async function handleSubmit() {
    setIsSubmit(true);
  }

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
        <Box sx={createPostLayout}>
          <Typography variant="h1" component="h2">
            Create post
          </Typography>
        </Box>
        <Box sx={createPostLayout}>
          <Typography variant="h5" margin="0 0 1vh 0">
            Title
          </Typography>
          <TextField
            //defaultValue={initialValue.title}
            variant="outlined"
            fullWidth
            placeholder="เช่น หาเพื่อนไปเที่ยวบอร์ดเกม"
            value={title}
            onChange={handleTitleChange}
            inputProps={{ maxLength: 100 }}
          />
          {isSubmit && isTitleErr && (
            <Box display="flex">
              <FormHelperText error>{titleErrMsg}</FormHelperText>
            </Box>
          )}
          <div style={helperTextBox}>
            <FormHelperText sx={helperText}>{title.length}/100</FormHelperText>
          </div>
        </Box>

        <Box sx={createPostLayout}>
          <Typography variant="h5" margin="0 0 1vh 0">
            Location
          </Typography>
          <Stack spacing={2}>
            <GoogleMaps initialValue={initialValue.location} />
          </Stack>
        </Box>
        <Box sx={createPostLayout}>
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
              {/*isSubmit && isStartDateErr && (
                <p style={{ color: "red" }}>{startDateErrMsg}</p>
              )*/}
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
              {/*isSubmit && isEndDateErr && (
                <p style={{ color: "red" }}>{endDateErrMsg}</p>
              )*/}
              <div style={helperTextBox}>
                <FormHelperText sx={helperTextError}>
                  ช่องนี้ไม่สามารถเว้นว่างได้
                </FormHelperText>
              </div>
            </Grid>
          </Grid>
        </Box>
        <Box sx={createPostLayout}>
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
        <Box sx={createPostLayout}>
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
          <div style={helperTextBox}>
            <FormHelperText sx={helperTextError}>
              ช่องนี้ไม่สามารถเว้นว่างได้
            </FormHelperText>
            <FormHelperText sx={helperText}>0/500</FormHelperText>
          </div>
        </Box>
        <Box sx={createPostLayout}>
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
            <Typography style={fontDesign} onClick={handleSubmit}>
              Create Post
            </Typography>
          </Button>
        </Box>
      </Stack>
    </>
  );
};

export default createPost;
