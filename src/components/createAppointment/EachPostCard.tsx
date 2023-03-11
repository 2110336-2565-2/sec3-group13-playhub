import {
  Typography,
  Avatar,
  Card,
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
import { PagePaths } from "enum/pages";
import { NextRouter, useRouter } from "next/router";
const styles = {
  //boxSizing: "border-box",//padding: "0 0 20px 0",
  position: "static",
  background: "#FFFFFF",
  border: "5px solid #000000",
  boxShadow: "10px 10px 1px rgba(0, 0, 0, 0.25)",
  borderRadius: "30px",
  width: "60%",
  flexDirection: "row",
  padding: "0 0 50px 0",
};

type props = {
  post: Post;
  //handleDeletePost: (toDeletePost: Post) => void;
  isLeft: Boolean;
};
export default function EachPostCard(props: props) {
  const router: NextRouter = useRouter();
  return (
    <>
      <Card sx={[styles, { float: props.isLeft ? "right" : "left" }]}>
        <CardHeader
          avatar={
            <IconButton
              onClick={() => {
                router.push(PagePaths.profile + props.post.ownerId);
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
          titleTypographyProps={{ fontWeight: "700", fontSize: "32px" }}
          subheaderTypographyProps={{ fontWeight: "400", fontSize: "16px" }}
          //action={}
        />
        <CardContent style={{ padding: "0px 16px", marginLeft: 50, marginRight: 50 }}>
          {/* post preview details start here */}
          <Stack direction={"column"} spacing={2} marginBottom={2}>
            <Typography display="inline-flex">
              <LocationOnIcon fontSize="medium" />
              <span style={{ marginLeft: 8 }}>{props.post.location.slice(0, 80)}</span>
            </Typography>
            <Typography display="inline-flex">
              <CalendarTodayIcon fontSize="medium" />
              <span style={{ marginLeft: 8 }}>
                {dayjs(props.post.startDateTime).format("DD/MM/YYYY h.mm A")} -{" "}
                {dayjs(props.post.endDateTime).format("DD/MM/YYYY h.mm A")}
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
      </Card>
    </>
  );
}