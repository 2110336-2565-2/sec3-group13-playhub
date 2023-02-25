
import Image from "next/image";
import BorderWithShadow from "../public/BorderWithShadow";
import AppointmentHeader from "./AppointmentHeader";
import AddParticipant from "./AddParticipant";
import React, { Fragment } from 'react';
import { Dayjs } from "dayjs";
import { AppointmentDetailHeader } from "@/types/Appointment";
import { CardContent, Card, Grid, Stack, Typography, Box, Chip } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TagComponent from "../public/TagComponent";
import FloatTextField from "../public/FloatTextField";
const chipsStyle = {
    minWidth: 100,
    height: 40,
    fontSize: 18,
    fontWeight: 'bold',
    border: "black solid 4px",
    borderRadius: "16px",
    boxShadow: "4px 4px #BFBFBF",
}
const textboxShadow = {
    border: "solid 4px",
    borderRadius: "16px",
    boxShadow: "8px 8px #BFBFBF",
};
const textinBox = {
    display: "inline-flex",
    height: '50px',
    alignItems: 'center',
    paddingLeft: '8px'
}


type props = {
    leftSideData: AppointmentDetailHeader,
    isUnClick: boolean
};



function formatDateTime(
    datetime: Dayjs | null
): string {

    if (datetime !== null) {
        return (datetime.format('dddd D MMMM YYYY h.mm A'))
    }
    return ("")

}
export default function LeftCard(props: props) {



    return (<>
        <BorderWithShadow>
            <CardContent>
                <Stack spacing="12px" sx={{ padding: "20px", height: "100%" }}>
                    <Box>
                        <FloatTextField
                            header={"Title"}
                            value={props.leftSideData.title}
                            isErr={false}
                            errMsg={""}
                            //handleValueChange={() => ()}
                            isMultiLine={false}
                            isUnClick={props.isUnClick} />
                    </Box>
                    <Box>
                        <FloatTextField
                            header={"Location"}
                            value={props.leftSideData.location}
                            isErr={false}
                            errMsg={""}
                            isMultiLine={false}
                            isUnClick={props.isUnClick} />
                    </Box>
                    <Box>
                        <FloatTextField
                            header={"Date & Time"}
                            value={formatDateTime(props.leftSideData.startDateTime) + " - " + formatDateTime(props.leftSideData.endDateTime)}
                            isErr={false}
                            errMsg={""}
                            isMultiLine={false}
                            isUnClick={props.isUnClick} />
                    </Box>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>Tag</Typography>
                        <Grid container spacing={1}>
                            {props.leftSideData.tags.map((e, index) => (
                                <Grid item key={'t' + index}>
                                    <TagComponent message={e.name}></TagComponent>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                    <Box>
                        <FloatTextField
                            header={"Description"}
                            value={props.leftSideData.description}
                            isErr={false}
                            errMsg={""}
                            isMultiLine={true}
                            isUnClick={props.isUnClick}
                            mediumSize={false}
                        />
                    </Box>

                </Stack>
            </CardContent>
        </BorderWithShadow>
    </>);
}