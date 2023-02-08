import React from 'react'
import Navbar from "@/components/public/Navbar";
import {
  Grid,
  Typography,
  TextField,
  Button,
  FormHelperText,
  Stack,
  Autocomplete,
} from "@mui/material"
import dayjs, { Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import PictureList from '@/components/createPost/pictureList';

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


    const [value, setValue] = React.useState<Dayjs | null>(
      dayjs('2014-08-18T21:11:54'),
    );
  
    const handleChange = (newValue: Dayjs | null) => {
      setValue(newValue);
    };

  
  const Location = [
    {title:"Poseidon entertainment complex"},
    {title:"Jod Fair"}
  ]
  const Tags= [
    {Tag:"RPG"},
    {Tag:"Car"},
    {Tag:"CO-OP"},
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
            <TextField variant="outlined" fullWidth size="small" placeholder="เช่น หาเพื่อนไปเที่ยวบอร์ดเกม"/>
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
        renderInput={(params) => <TextField {...params} placeholder="เลือกสถานที่" />}
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                  value={value}
                  onChange={handleChange}
                  renderInput={(params) => <TextField {...params} fullWidth/>}/>    
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
                    renderInput={(params) => <TextField {...params} fullWidth />}/>
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
          <TextField variant="outlined" fullWidth size="medium" placeholder="เช่น มาเที่ยวกันเลย ร้านบอร์ดเกมแถวรัชดา" />
            <div style={helperTextBox}>
              <FormHelperText sx={helperTextError}>ช่องนี้ไม่สามารถเว้นว่างได้</FormHelperText>
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
            <PictureList/>
          



          </Stack>
        </Grid>


        </div>
        <Grid item>
          <Button variant="contained" sx={saveBtn}>
            <Typography variant="subtitle1">Create Post</Typography>
          </Button>
        </Grid>

      </Grid>
    
    </>
  )
}

export default createPost
