import React from 'react'
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
  Autocomplete
} from "@mui/material";
const createPost = () => {
  const error = "#ff0000";
  const avatar = { width: 200, height: 200 };
  const overlayIcon = {
    position: "absolute",
    color: "black",
    fontSize: "7.5vw",
    opacity: "0.5",
  };
  const imgErrorWarning = {
    textAlign: "center",
    color: error,
    display: "none",
  };
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
  const warningTxt = {
    color: error,
  };

  
  const Location = [
    {title:"Poseidon entertainment complex"},
    {title:"Jod Fair"}
  ]
  

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
        <Typography variant="h1" component="h2">Create post</Typography>
        </Grid>


        <div style={editInfoContainer}>
          <Grid item > 
            <Typography variant="h5">Title</Typography>
            <TextField variant="outlined" fullWidth size="small" label="เช่น หาเพื่อนไปเที่ยวบอร์ดเกม"/>
            <div style={helperTextBox}>
              <FormHelperText sx={helperTextError}>ช่องนี้ไม่สามารถเว้นว่างได้</FormHelperText>
              <FormHelperText sx={helperText}>0/100</FormHelperText>
            </div>
          </Grid>
          <Grid item>
            <Typography variant="h5">Location</Typography>
            
            <Stack spacing={2} >
      <Autocomplete
        id="free-solo-demo"
        freeSolo
        options={Location.map((option) => option.title)}
        renderInput={(params) => <TextField {...params} label="เลือกสถานที่" />}
      /></Stack>
              
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
                <TextField variant="outlined" fullWidth size="small" label="คลิกเพื่อเลือกเวลาเริ่มต้น"/>
                <div style={helperTextBox}>
                  <FormHelperText sx={helperTextError}>ช่องนี้ไม่สามารถเว้นว่างได้</FormHelperText>
                </div>
            
            </Grid> 

          <Grid item xs={6}>
                <Typography variant="body1">End</Typography>
                  <TextField variant="outlined" fullWidth size="small" label="คลิกเพื่อเลือกเวลาสิ้นสุด"/>
                  <div style={helperTextBox}>
                    <FormHelperText sx={helperTextError}>ช่องนี้ไม่สามารถเว้นว่างได้</FormHelperText>
                  </div>
            
          </Grid> 

        </Grid>

          </Grid>


          <Grid item>
            <Typography variant="h5">Tag</Typography>
            
          </Grid>
          

          
        </div>
        <Grid item>
          <Button variant="contained" sx={saveBtn}>
            <Typography variant="subtitle1">Edit</Typography>
          </Button>
        </Grid>

      </Grid>
    
    </>
  )
}

export default createPost
