import React from "react";
import Navbar from "@/components/public/Navbar";
import { Box, Link, Typography, Grid } from "@mui/material";
const MainLayout = {
  margin: "1vh 0 0 0",
  border: "1px dashed grey",
  textAlign: "center",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  flexDirection: "row",
  padding: "40px",
};
export default function Home() {
  return (
    <>
      <Navbar />
      <Box sx={{ margin: "5vh 0 0 0" }}>
        <Typography variant="h1" sx={{ fontWeight: "700", fontSize: "40px" }}>
          Create Appointment
        </Typography>
      </Box>
      <Grid container spacing={2} sx={MainLayout}>
        <Grid item xs={6} sx={{ border: "1px dashed red" }}>
          ควย
          {/* Content for column 1 */}
        </Grid>
        <Grid item xs={6} sx={{ border: "1px dashed red" }}>
          ควย
          {/* Content for column 2 */}
        </Grid>
      </Grid>
    </>
  );
}
