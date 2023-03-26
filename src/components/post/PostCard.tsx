import {
  Typography,
  Avatar,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Stack,
  CardActionArea,
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import { Post } from "../../types/Post";
import { PAGE_PATHS } from "enum/PAGES";
import { NextRouter, useRouter } from "next/router";
import DisplayTags from "./DisplayTags";
import dayjs from "dayjs";

type props = {
  post: Post;
};

export default function PostCard(props: props) {
  const router: NextRouter = useRouter();

  function goToCardDetail() {
    router.push(PAGE_PATHS.POST + props.post.postId);
    return;
  }

  return (
    <>
      <Card sx={{ borderRadius: "30px", minWidth: "500px" }}>
        <CardActionArea onClick={goToCardDetail}>
          {/* Post Card Header */}
          <CardHeader
            sx={{ height: "6vh" }}
            avatar={
              <IconButton
                onClick={() => {
                  router.push(PAGE_PATHS.PROFILE + props.post.ownerId);
                  return;
                }}
                sx={{ padding: 0 }}
              >
                <Avatar
                  sx={{ width: 50, height: 50, zIndex: "1" }}
                  alt="Profile picture"
                  src={props.post.ownerProfilePic}
                />
              </IconButton>
            }
            title={
              <Typography
                variant="h1"
                align="left"
                display="block"
                sx={{
                  width: "31vw",
                  minWidth: "400px",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}>
                {props.post.title}
              </Typography>}
            subheader={
              <Typography
                variant="body1"
                align="left"
                display="block"
                sx={{
                  width: "31vw",
                  minWidth: "400px",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}>
                {props.post.ownerName}
              </Typography>}
          />
          <CardContent style={{ height: "17vh", minHeight: "160px", paddingLeft: 82, paddingTop: 0 }}>
            <Stack spacing={2} marginBottom={2}>
              {/* location */}
              <Typography variant="body1" display="inline-flex">
                <LocationOnIcon fontSize="medium" />
                <Typography
                  style={{ marginLeft: 8 }}
                  sx={{
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}>
                  {props.post.location}
                </Typography>
              </Typography>

              {/* date */}
              <Typography variant="body1" display="inline-flex">
                <CalendarTodayIcon fontSize="medium" />
                <Typography style={{ marginLeft: 8 }} sx={{
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}>
                  {dayjs(props.post.startDateTime).format("DD/MM/YYYY h:mm A")} - {dayjs(props.post.endDateTime).format("DD/MM/YYYY h:mm A")}
                </Typography>
              </Typography>
            </Stack>

            {/* tags */}
            <DisplayTags tags={props.post.tags} />
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}
