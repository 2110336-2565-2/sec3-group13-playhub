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

type props = {
  post: Post;
};

export default function PostCard(props: props) {
  const router: NextRouter = useRouter();

  function goToCardDetail() {
    router.push(PAGE_PATHS.POST + props.post.postId);
  }

  return (
    <>
      <Card sx={{ borderRadius: "30px" }}>
        <CardActionArea onClick={goToCardDetail}>
          {/* Post Card Header */}
          <CardHeader
            sx={{ height: "6vh" }}
            avatar={
              <IconButton
                onClick={() => {
                  router.push(PAGE_PATHS.PROFILE + props.post.ownerId);
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
            title={props.post.title}
            subheader={props.post.ownerName}
            titleTypographyProps={{ variant: "h1", align: "left" }}
            subheaderTypographyProps={{ variant: "body1" }}
          />
          <CardContent style={{ height: "18vh", paddingLeft: 82, paddingTop: 0 }}>
            <Stack spacing={2} marginBottom={2}>
              {/* location */}
              <Typography variant="body1" display="inline-flex">
                <LocationOnIcon fontSize="medium" />
                <span style={{ marginLeft: 8 }}>{props.post.location}</span>
              </Typography>
              {/* date */}
              <Typography variant="body1" display="inline-flex">
                <CalendarTodayIcon fontSize="medium" />
                <span style={{ marginLeft: 8 }}>
                  {props.post.startDateTime} - {props.post.endDateTime}
                </span>
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
