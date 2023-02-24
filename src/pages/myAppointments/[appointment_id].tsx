import React from "react";
import Navbar from "@/components/public/Navbar";
import { Box, Link } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AppointmentParticipantCard from "@/components/appointment/AppointmentParticipantCard";
import AppointmentHostCard from "@/components/appointment/AppointmentHostCard";
import { AppointmentDetail, AppointmentDetailHeader } from "@/types/Appointment";

const mockHeader: AppointmentDetailHeader = {
  title: "Come join me",
  location: "tiananmen square",
  startDateTime: "15/4/1989",
  endDateTime: "4/6/1989",
  tags: ["WAR_GAME", "WAR_CRY", "lnwZA"],
  description: "มาเล่นบอดกันเถอะ\nสนุกๆๆๆๆ"
}
const mockData: AppointmentDetail = {
  detailHeader: mockHeader,
  images: ['https://yhvwtxoqpasglonyjmpe.supabase.co/storage/v1/object/public/locationimage/6301676479272331?t=2023-02-23T14%3A17%3A21.623Z', 'https://yhvwtxoqpasglonyjmpe.supabase.co/storage/v1/object/public/locationimage/7f6184d2-91dc-478e-911b-e18b7e17cec901676866401794'],
  participantAmount: 10,
  pendingParticipants: ["Participant11", "Participant12", "Participant13"],
  acceptParticipants: ["Participant1", "Participant2", "Participant3", "Participant4", "Participant5", "Participant6", "Participant7", "Participant8", "Participant9", "Participant10"],
  rejectParticipants: ["John", "User1", "User2"]
}
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
      {isHost ? <AppointmentHostCard appointmentDetail={mockData} />
        : <AppointmentParticipantCard appointmentDetail={mockData} />}
    </Box>
  </>;
}