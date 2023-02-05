import React from "react";
import { useState } from "react";
import Navbar from "@/components/public/Navbar";
import { editProfileHeader } from "public/locales/editProfileHeader";
import {
  Avatar,
  Grid,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  FormHelperText,
  Stack,
  Autocomplete,
  Chip,
  Paper,
} from "@mui/material";
import Icon from "@mui/material/Icon";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { styled } from "@mui/material/styles";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

const createPost = () => {
  const error = "#ff0000";

  const editInfoContainer = {
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
  const saveBtn = {
    backgroundColor: "#ffa31a",
    color: "black",
  };
  const itemData = [
    {
      img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
      title: "Breakfast",
    },
    {
      img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
      title: "Burger",
    },
    {
      img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
      title: "Camera",
    },
    {
      img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
      title: "Coffee",
    },
    {
      img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
      title: "Hats",
    },
    {
      img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
      title: "Honey",
    },
    {
      img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
      title: "Basketball",
    },
    {
      img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
      title: "Fern",
    },
    {
      img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
      title: "Mushrooms",
    },
    {
      img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
      title: "Tomato basil",
    },
    {
      img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
      title: "Sea star",
    },
    {
      img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
      title: "Bike",
    },
  ];

  const [value, setValue] = React.useState<Dayjs | null>(dayjs("2014-08-18T21:11:54"));

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
  };

  const Location = [{ title: "Poseidon entertainment complex" }, { title: "Jod Fair" }];
  const Tags = [{ Tag: "RPG" }, { Tag: "Car" }, { Tag: "CO-OP" }];
  const ListItem = styled("li")(({ theme }) => ({
    margin: theme.spacing(0.5),
  }));
  const [chipData, setChipData] = React.useState<readonly ChipData[]>([
    { key: 0, label: "Angular" },
    { key: 1, label: "jQuery" },
    { key: 2, label: "Polymer" },
    { key: 3, label: "React" },
    { key: 4, label: "Vue.js" },
  ]);

  const handleDelete = (chipToDelete: ChipData) => () => {
    setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  const handleAddTag = (chipToAdd: ChipData) => () => {
    //setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
    //I don't know how to do, But When click it i want it to show selector(list of tag) then i can click it to add into chipData
  };

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

        <div style={editInfoContainer}>
          <Grid item>
            <Typography variant="h5">Title</Typography>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              placeholder="เช่น หาเพื่อนไปเที่ยวบอร์ดเกม"
            />
            <div style={helperTextBox}>
              <FormHelperText sx={helperTextError}>ช่องนี้ไม่สามารถเว้นว่างได้</FormHelperText>
              <FormHelperText sx={helperText}>0/100</FormHelperText>
            </div>
          </Grid>
          <Grid item>
            <Typography variant="h5">Location</Typography>

            <Stack spacing={2}>
              <Autocomplete
                id="free-solo-demo"
                freeSolo
                options={Location.map((option) => option.title)}
                renderInput={(params) => <TextField {...params} placeholder="เลือกสถานที่" />}
              />
            </Stack>

            <div style={helperTextBox}>
              <FormHelperText sx={helperTextError}>ช่องนี้ไม่สามารถเว้นว่างได้</FormHelperText>
              <FormHelperText sx={helperText}>0/100</FormHelperText>
            </div>
          </Grid>

          <Grid item>
            <Typography variant="h5">Date time</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body1">Start</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    value={value}
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
                <div style={helperTextBox}>
                  <FormHelperText sx={helperTextError}>ช่องนี้ไม่สามารถเว้นว่างได้</FormHelperText>
                </div>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body1">End</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    value={value}
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
                <div style={helperTextBox}>
                  <FormHelperText sx={helperTextError}>ช่องนี้ไม่สามารถเว้นว่างได้</FormHelperText>
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
              getOptionLabel={(option) => option.Tag}
              renderInput={(params) => (
                <TextField {...params} placeholder="Click for add tag" fullWidth />
              )}
            />
          </Grid>

          <Grid item>
            <Typography variant="h5">Description</Typography>
            <TextField
              variant="outlined"
              fullWidth
              size="Big"
              placeholder="เช่น มาเที่ยวกันเลย ร้านบอร์ดเกมแถวรัชดา"
            />
            <div style={helperTextBox}>
              <FormHelperText sx={helperTextError}>ช่องนี้ไม่สามารถเว้นว่างได้</FormHelperText>
              <FormHelperText sx={helperText}>0/500</FormHelperText>
            </div>
          </Grid>
          <Grid item>
            <Typography variant="h5">Image(Optional)</Typography>
          </Grid>
        </div>
        <Grid item>
          <Button variant="contained" sx={saveBtn}>
            <Typography variant="subtitle1">Create Post</Typography>
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default createPost;
