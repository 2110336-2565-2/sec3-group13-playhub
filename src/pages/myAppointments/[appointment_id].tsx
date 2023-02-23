import React from "react";
import Navbar from "@/components/public/Navbar";
import { Box, Link } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AppointmentParticipantCard from "@/components/appointment/AppointmentParticipantCard";
import AppointmentHostCard from "@/components/appointment/AppointmentHostCard";

const isHost = true;
export default function Home() {

  return <>
    <Navbar />
    <Box
      display="flex"
      paddingBottom="40px"
    >
      <Link>
        <ArrowBackIcon
          fontSize="large"
          sx={{ position: "absolute", margin: "3vh 0 0 3vh", color: "black" }}
        />
      </Link>
    </Box>
    <Box
      display="flex"
      justifyContent="center"
      padding="40px"
    >
      {isHost ? <AppointmentHostCard /> : <AppointmentParticipantCard />}
    </Box>
  </>;
}