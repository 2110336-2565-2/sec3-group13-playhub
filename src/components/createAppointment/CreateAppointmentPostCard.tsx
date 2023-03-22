import {
  Typography,
  Avatar,
  Box,
  CardHeader,
  CardContent,
  IconButton,
  Grid,
  Stack,
} from "@mui/material";
import TagComponent from "../public/TagComponent";
import dayjs from "dayjs";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { Post } from "../../types/Post";
import { PAGE_PATHS } from "enum/PAGES";
import { NextRouter, useRouter } from "next/router";
import BorderWithShadow from "../public/BorderWithShadow";

type props = {
  post: Post;
};

export default function CreateAppointmentPostCard(props: props) {
  const router: NextRouter = useRouter();
  return (
    <BorderWithShadow>
      <Box sx={{ width: "100%", height: "300px" }}>
        <CardHeader
          avatar={
            <IconButton
              onClick={() => {
                router.push(PAGE_PATHS.PROFILE + props.post.ownerId);
                return;
              }}
              sx={{ padding: 0 }}
            >
              <Avatar
                sx={{ width: 50, height: 50 }}
                alt="Profile picture"
                src={props.post.ownerProfilePic}
              />
            </IconButton>
          }
          title={props.post.title}
          subheader={props.post.ownerName}
          titleTypographyProps={{ variant: "h5" }}
          subheaderTypographyProps={{ fontWeight: "400", fontSize: "16px" }}
        />
        <CardContent style={{ padding: "0px 16px", marginLeft: 50, marginRight: 50 }}>
          {/* post preview details start here */}
          <Stack direction={"column"} spacing={2} marginBottom={2}>
            <Typography display="inline-flex">
              <LocationOnIcon fontSize="medium" />
              <span style={{ marginLeft: 8 }}>{props.post.location.slice(0, 60)}</span>
            </Typography>
            <Typography display="inline-flex">
              <CalendarTodayIcon fontSize="medium" />
              <span style={{ marginLeft: 8 }}>
                {dayjs(props.post.startDateTime).format("DD/MM/YYYY h:mm A")} -{" "}
                {dayjs(props.post.endDateTime).format("DD/MM/YYYY h:mm A")}
              </span>
            </Typography>
          </Stack>
          <Grid container spacing={1}>
            {props.post.tags.map((e, index) => (
              <Grid item key={index}>
                <TagComponent message={e} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Box>
    </BorderWithShadow>
  );
}
