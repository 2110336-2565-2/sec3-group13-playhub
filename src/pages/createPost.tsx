import React, { useEffect, useState } from "react";
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

type formErrors = {
  title: string;
  locationTitle: string;
  startDate: string;
  desc: string;
  endDate: string;
  selectedTags: string[];
  images: string[];
};

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
    color: "error",
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
    color: "secondary.main",
  };
  const [isSubmit, setIsSubmit] = React.useState(false);
  // value of every text field

  const [title, setTitle] = React.useState("");
  const [locationTitle, setLocationTitle] = React.useState<string>("");
  const [startDate, setStartDate] = React.useState<Dayjs | null>(
    dayjs(initialValue.startDateTime === "" ? null : initialValue.startDateTime)
  );
  const [endDate, setEndDate] = React.useState<Dayjs | null>(
    initialValue.endDateTime === "" ? null : dayjs(initialValue.endDateTime)
  );
  const [selectedTags, setSelectedTags] = useState(initialValue.tags);
  const [desc, setDesc] = React.useState(initialValue.description);
  const [images, setImages] = useState<string[]>([]);
  // value of every text field

  //----For Error----

  const [imgErrState, setImgErrState] = useState(false);
  const [formErrors, setFormErrors] = useState({
    title: "",
    location: "",
    startDate: "",
    endDate: "",
    selectedTags: "",
    desc: "",
  });

  //const [formErrors, setFormErrors] = useState({});
  useEffect(() => {
    setImages(initialValue.image);
  }, []);

  function handleTitleChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    setTitle(event.target.value);
    formErrors.title = "";

    //setIsSubmit(false);
  }

  function handleDescChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    setDesc(event.target.value);
    formErrors.desc = "";
    //setIsSubmit(false);
  }
  function handleLocationChange(newValue: string): void {
    setLocationTitle(newValue);
    formErrors.location = "";
    //setIsSubmit(false);
  }

  function handleAddTag(event: any, tag: any): void {
    if (tag.length <= 5) {
      setSelectedTags(tag);
      formErrors.selectedTags = "";
    }
    // setIsSubmit(false);
  }

  function handleStartDate(newValue: Dayjs | null): void {
    setStartDate(newValue);
    if (message.checkStartDate(startDate) !== "") {
      formErrors.startDate = message.checkStartDate(startDate);
    } else {
      formErrors.startDate = "";
    }

    //
    //setIsSubmit(false);
  }
  function handleEndDate(newValue: Dayjs | null): void {
    setEndDate(newValue);
    if (message.checkEndDate(startDate, endDate) !== "") {
      formErrors.endDate = message.checkEndDate(startDate, endDate);
    } else {
      formErrors.endDate = "";
    }
  }

  const handleSubmit = () => {
    //DIY NA Backend
    setIsSubmit(true);

    // Perform validation on the form data
    const errors = {
      title: "",
      location: "",
      startDate: "",
      endDate: "",
      selectedTags: "",
      desc: "",
    };
    if (message.checkTitle(title) !== "") {
      errors.title = message.checkTitle(title);
      setFormErrors(errors);
      return;
    }
    if (locationTitle.trim() === "") {
      errors.location = "ช่องนี้ไม่สามารถเว้นว่างได้";
      setFormErrors(errors);
      return;
    }
    if (message.checkStartDate(startDate) !== "") {
      errors.startDate = message.checkStartDate(startDate);
      setFormErrors(errors);
      return;
    }
    if (message.checkEndDate(startDate, endDate) !== "") {
      errors.endDate = message.checkEndDate(startDate, endDate);
      setFormErrors(errors);
      return;
    }
    if (message.checkTag(selectedTags) !== "") {
      errors.selectedTags = message.checkTag(selectedTags);
      setFormErrors(errors);
      return;
    }
    if (message.checkDesc(desc) !== "") {
      errors.desc = message.checkDesc(desc);
      setFormErrors(errors);
      return;
    }

    console.log("Form submitted");
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
          {isSubmit && formErrors.title && (
            <Box display="flex">
              <FormHelperText error>{formErrors.title}</FormHelperText>
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
            <GoogleMaps
              initialValue={initialValue.location}
              //locationTitle={setLocationTitle}
              onChange={handleLocationChange}
            />
            {isSubmit && formErrors.location && (
              <Box display="flex">
                <FormHelperText error>{formErrors.location}</FormHelperText>
              </Box>
            )}
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
              {formErrors.startDate && (
                <FormHelperText error>{formErrors.startDate}</FormHelperText>
              )}
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
              {formErrors.endDate && (
                <FormHelperText error>{formErrors.endDate}</FormHelperText>
              )}
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
            renderTags={
              (value: readonly string[], getTagProps) =>
                //selectedTags.length <= 4
                value.map((option: string, index: number) => (
                  <Paper
                    key={index}
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
              //: null
            }
            renderInput={
              (params) => (
                //selectedTags.length <= 5 ? (

                <TextField
                  {...params}
                  placeholder={
                    selectedTags.length < 5
                      ? "คลิกเพื่อเลือก Tags (เลือกได้สูงสุด 5 Tags)"
                      : ""
                  }
                  fullWidth
                />
              ) //: null
            }
          />
          {isSubmit && formErrors.selectedTags && (
            <FormHelperText error>{formErrors.selectedTags}</FormHelperText>
          )}
        </Box>
        <Box sx={createPostLayout}>
          <Typography variant="h5" margin="0 0 1vh 0">
            Description
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            size="medium"
            placeholder="เช่น มาเที่ยวกันเลย ร้านบอร์ดเกมแถวรัชดา"
            value={desc}
            onChange={handleDescChange}
            inputProps={{ maxLength: 500 }}
          />
          {isSubmit && formErrors.desc && (
            <Box display="flex">
              <FormHelperText error>{formErrors.desc}</FormHelperText>
            </Box>
          )}
          <div style={helperTextBox}>
            <FormHelperText sx={helperText}>{desc.length}/500</FormHelperText>
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
            <PictureList
              imgs={images}
              stateChanger={setImages}
              st={setImgErrState}
            />
          </Stack>
          {imgErrState && (
            <FormHelperText error>เลือกรูปภาพได้ไม่เกิน 3 รูป</FormHelperText>
          )}
        </Box>
        <Box justifyContent="center" alignItems="center">
          <Button variant="contained" color="primary">
            <Typography onClick={handleSubmit}>Create Post</Typography>
          </Button>
        </Box>
      </Stack>
    </>
  );
};

export default createPost;
