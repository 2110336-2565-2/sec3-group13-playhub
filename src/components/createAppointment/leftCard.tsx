import BorderWithShadow from "../public/BorderWithShadow";
import React from "react";
import { Dayjs } from "dayjs";
import { AppointmentDetailHeader } from "@/types/Appointment";
import { CardContent, Grid, Stack, Typography, Box } from "@mui/material";
import TagComponent from "../public/TagComponent";
import FloatTextField from "../public/FloatTextField";

type props = {
  leftSideData: AppointmentDetailHeader;
  isUnClick: boolean;
};

function formatDateTime(datetime: Dayjs | null): string {
  if (datetime !== null) {
    return datetime.format("dddd D MMMM YYYY h.mm A");
  }
  return "";
}
export default function LeftCard(props: props) {
  return (
    <>
      <BorderWithShadow>
        <CardContent>
          <Stack spacing="12px" sx={{ padding: "20px", height: "100%" }}>
            {/*  Title */}
            <Box>
              <FloatTextField
                header={"Title"}
                value={props.leftSideData.title}
                isErr={false}
                errMsg={""}
                isMultiLine={false}
                isUnClick={props.isUnClick}
              />
            </Box>
            {/*  Location */}
            <Box>
              <FloatTextField
                header={"Location"}
                value={props.leftSideData.location}
                isErr={false}
                errMsg={""}
                isMultiLine={false}
                isUnClick={props.isUnClick}
              />
            </Box>
            {/*  DateTime */}
            <Box>
              <FloatTextField
                header={"Date & Time"}
                value={
                  props !== null
                    ? formatDateTime(props.leftSideData.startDateTime) +
                      " - " +
                      formatDateTime(props.leftSideData.endDateTime)
                    : ""
                }
                isErr={false}
                errMsg={""}
                isMultiLine={false}
                isUnClick={props.isUnClick}
              />
            </Box>
            {/*  Tag */}
            <Box>
              <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "4px" }}>
                Tag
              </Typography>
              <Grid container spacing={1}>
                {props.leftSideData.tags.map((e, index) => (
                  <Grid item key={"t" + index}>
                    <TagComponent message={e.name}></TagComponent>
                  </Grid>
                ))}
              </Grid>
            </Box>
            {/*  Description */}
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
    </>
  );
}
