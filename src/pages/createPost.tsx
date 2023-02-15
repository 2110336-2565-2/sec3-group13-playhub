import { useEffect, useState, useContext, ChangeEvent } from "react";
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
import { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import PictureList from "@/components/createPost/pictureList";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GoogleMaps from "@/components/createPost/searchMaps";
import * as message from "@/utilities/createPostVal";
import { Tag } from "@/types/Tag";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { userContext } from "supabase/user_context";
import Loading from "@/components/public/Loading";
import { useRouter } from "next/router";
import { PagePaths } from "enum/pages";

const CreatePost = () => {

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

  const userStatus = useContext(userContext);
  const supabaseClient = useSupabaseClient<Database>();
  const router = useRouter();
  const [isSubmit, setIsSubmit] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  const [locationTitle, setLocationTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [desc, setDesc] = useState("");
  const [fileImages, setFileImages] = useState<File[]>([]);

  const [imgErrState, setImgErrState] = useState(false);
  const [formErrors, setFormErrors] = useState({
    title: "",
    location: "",
    startDate: "",
    endDate: "",
    selectedTags: "",
    desc: "",
  });

  function handleTitleChange(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    setTitle(event.target.value);
    formErrors.title = "";

    //setIsSubmit(false);
  }

  function handleDescChange(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
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

  function handleAddTag(event: any, tag: string[]): void {
    if (tag.length <= 5) {
      setSelectedTags(tags.filter((value) => tag.includes(value.name)));
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

  const handleSubmit = async () => {
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

    console.log("sad")
    const addPostResult = await supabaseClient.rpc("add_post", {
      title: title,
      location: locationTitle,
      description: desc,
      owner_id: userStatus.user?.user_id,
      start_timestamp: startDate,
      end_timestamp: endDate
    })
    if (addPostResult.error) {
      console.log(addPostResult.error)
      return
    }

    console.log(addPostResult.data)
    
    selectedTags.forEach(async (e) => {
      await supabaseClient.rpc("add_post_tag", {
        tag_id: e.id,
        post_id: addPostResult.data
      })
    })

    const now = Date.now();
    fileImages.forEach(async (e, index) => {
      const filePath = addPostResult.data.toString() + index.toString() + now.toString()
      const uploadResult = await supabaseClient.storage.from("locationimage").upload(filePath,e)
      if (uploadResult.error) return
      const imageUrlResult = await supabaseClient.storage.from("locationimage").getPublicUrl(filePath)
      await supabaseClient.rpc("add_post_image", {
        post_id: addPostResult.data,
        image: imageUrlResult.data.publicUrl
      })
    })
    router.push(PagePaths.myPosts)
  };

  useEffect(() => {
    async function getTags() {
      const getTagsResult = await supabaseClient.rpc("get_all_possible_tags");
      if (getTagsResult.error) {
        console.log(getTagsResult.error)
        return
      }
      setTags(getTagsResult.data)
    }
    getTags();
  }, [supabaseClient]);

  if (userStatus.isLoading || tags.length == 0) return <Loading />
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
            options={tags.map((e) => e.name)}
            value={selectedTags.map((e) => e.name)}
            onChange={handleAddTag}
            renderTags={
              (value: readonly string[], getTagProps) =>
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
            }
            renderInput={
              (params) => (
                <TextField
                  {...params}
                  placeholder={
                    selectedTags.length < 5
                      ? "คลิกเพื่อเลือก Tags (เลือกได้สูงสุด 5 Tags)"
                      : ""
                  }
                  fullWidth
                />
              )
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
              imgs={fileImages}
              stateChanger={setFileImages}
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

export default CreatePost;