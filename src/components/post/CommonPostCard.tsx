import { useEffect, useState } from "react";
import { NextRouter, useRouter } from "next/router";
import {
  Typography,
  Avatar,
  Box,
  Collapse,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  Stack,
  Snackbar,
  Grow,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { IconButtonProps } from "@mui/material/IconButton";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import { Post } from "../../types/Post";
import { PAGE_PATHS } from "enum/PAGES";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { AddParticipantToPost, RemoveParticipantFromPost } from "@/services/Participant";
import { Database } from "supabase/db_types";
import CommonButton from "../public/CommonButton";
import { COLOR } from "enum/COLOR";
import DisplayTags from "./DisplayTags";
import DisplayImages from "./DisplayImages";
import dayjs from "dayjs";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

type props = {
  post: Post;
  userId: string | undefined;
};

type snackBar = {
  msg: string;
  isShow: boolean;
};

export default function PostCard(props: props) {
  const router: NextRouter = useRouter();
  const supabaseClient = useSupabaseClient<Database>();

  const [isUserJoin, setIsUserJoin] = useState<boolean>(false);
  const [hiddenPostDetail, setHiddenPostDetail] = useState<boolean>(true);
  const [openSnackBar, setOpenSnackBar] = useState<snackBar>({ msg: "", isShow: false });
  const handleExpandDetail = (): void => setHiddenPostDetail(!hiddenPostDetail);

  function hasJoined(): boolean {
    if (!props.post.participants) return false;
    for (let i = 0; i < props.post.participants.length; i++) {
      if (props.post.participants[i].userId === props.userId) {
        return true;
      }
    }
    return false;
  }

  const isJoined: boolean = hasJoined();

  useEffect(() => {
    if (isJoined) {
      setIsUserJoin(true);
    } else {
      setIsUserJoin(false);
    }
  }, [isJoined]);

  function joinPost(): void {
    if (!props.userId) return;
    if (!isUserJoin) {
      AddParticipantToPost(props.userId, props.post.postId, supabaseClient)
        .then(() => {
          setOpenSnackBar({ msg: `Join ${props.post.title} !`, isShow: true });
          setIsUserJoin(true);
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    } else {
      RemoveParticipantFromPost(props.userId, props.post.postId, supabaseClient)
        .then(() => {
          setOpenSnackBar({ msg: `Cancel ${props.post.title} !`, isShow: true });
          setIsUserJoin(false);
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    }
  }

  return (
    <>
      <Card
        sx={{
          border: "solid 4px",
          borderRadius: "16px",
          minWidth: "260px",
          maxWidth: "1200px",
        }}
      >
        {/* Post Card Header */}
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
          subheaderTypographyProps={{ variant: "h6" }}
        />
        <CardContent style={{ padding: "0px 16px", marginLeft: 50, marginRight: 50 }}>
          <Stack spacing={2}>
            {/* location */}
            <Typography display="inline-flex">
              <LocationOnIcon fontSize="medium" />
              <Typography style={{ marginLeft: 8 }}>{props.post.location}</Typography>
            </Typography>

            {/* datetime */}
            <Typography display="inline-flex">
              <CalendarTodayIcon fontSize="medium" />
              <span style={{ marginLeft: 8 }}>
                {props.post.startDateTime} - {props.post.endDateTime}
              </span>
            </Typography>

            {/* tags */}
            <DisplayTags tags={props.post.tags} />
          </Stack>

          <Collapse in={!hiddenPostDetail} sx={{ marginTop: 2, marginBottom: 1 }}>
            <Stack spacing={2}>
              {/* description */}
              <Typography>
                {props.post.description.split("\n").map((row) => (
                  <Typography key={row}>{row}</Typography>
                ))}
              </Typography>

              {/* images */}
              <DisplayImages images={props.post.image} />
            </Stack>
          </Collapse>
        </CardContent>

        {/* Post Card Footer */}
        <CardActions style={{ padding: "4px 8px" }}>
          <Box sx={{ flexGrow: 1 }}></Box>

          <Grow in={!hiddenPostDetail} style={{ transformOrigin: "0 0 0" }}>
            <Box>
              <CommonButton
                label={!isUserJoin ? "Join" : "Cancel"}
                onClick={() => joinPost()}
                color={!isUserJoin ? COLOR.PRIMARY : COLOR.NATURAL}
              />
            </Box>
          </Grow>

          <ExpandMore expand={!hiddenPostDetail} onClick={handleExpandDetail}>
            <ArrowDownwardIcon fontSize="large" color="secondary" />
          </ExpandMore>
        </CardActions>
      </Card>

      {/* Comfirm Delete Dialog */}
      <Snackbar
        open={openSnackBar.isShow}
        autoHideDuration={5000}
        message={openSnackBar.msg}
        onClose={() => setOpenSnackBar({ msg: "", isShow: false })}
      />
    </>
  );
}
