import AppointmentCard from "@/components/appointment/AppointmentCard";
import {testAppointment } from "@/types/Appointment";

export default function Home() {
    return <AppointmentCard appointment={testAppointment} />;
}