import React from "react";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/public/Navbar";
import {
  Grid,
  Typography,
  TextField,
  Button,
  FormHelperText,
  Stack,
  Autocomplete,
  Box,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import PictureList from "@/components/createPost/pictureList";
import UploadBox from "@/components/public/UploadBox";
import Image from "next/image";
import { Post } from "@/types/Post";
import { styled } from "@mui/material/styles";
import CancelIcon from "@mui/icons-material/Cancel";

const Input = styled("input")({
  display: "none",
});

export default function editPost() {
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

  const [value, setValue] = React.useState<Dayjs | null>(dayjs("2014-08-18T21:11:54"));

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
  };

  const Location = [{ title: "Poseidon entertainment complex" }, { title: "Jod Fair" }];
  const Tags = [{ Tag: "RPG" }, { Tag: "Car" }, { Tag: "CO-OP" }];

  const [images, setImages] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  // useEffect(() => {
  //   setImages(prop.image);
  // }, [prop.image]);

  const handleAddImages = () => {
    if (!inputRef || !inputRef.current) return;
    inputRef.current.click();
  };
  const handleImagesInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const img = URL.createObjectURL(selectedFile);
      setImages((prevImg) => prevImg.concat(img));
    }
  };
  const handleDeleteImage = (index: number) => {
    setImages((prevPics) => prevPics.filter((pic, i) => i !== index));
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
              size="medium"
              placeholder="เช่น มาเที่ยวกันเลย ร้านบอร์ดเกมแถวรัชดา"
            />
            <div style={helperTextBox}>
              <FormHelperText sx={helperTextError}>ช่องนี้ไม่สามารถเว้นว่างได้</FormHelperText>
              <FormHelperText sx={helperText}>0/500</FormHelperText>
            </div>
          </Grid>
          <Grid item>
            <Typography variant="h5">Image(Optional)</Typography>
            <Grid container marginTop={2} spacing={10}>
              {images ? (
                <>
                  {images.map((e, index) => (
                    <Grid
                      item
                      key={index}
                      style={{ position: "relative", padding: "30px 0px 0px 30px" }}
                    >
                      <Image src={e} alt="location" width={300} height={350} />
                      <CancelIcon
                        onClick={() => handleDeleteImage(index)}
                        style={{
                          fontSize: "30px",
                          position: "absolute",
                          top: 0,
                          right: 0,
                          color: "grey",
                        }}
                      />
                    </Grid>
                  ))}
                </>
              ) : null}
              <Grid
                item
                sx={{ display: images.length == 3 ? "none" : null }}
                style={{ padding: "30px 0px 0px 30px" }}
              >
                <Input type="file" accept="image/*" ref={inputRef} onChange={handleImagesInput} />
                <UploadBox onClick={handleAddImages} />
              </Grid>
            </Grid>
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
}
