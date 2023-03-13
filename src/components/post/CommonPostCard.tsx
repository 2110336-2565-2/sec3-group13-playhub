import { useEffect, useState } from "react";
import { NextRouter, useRouter } from "next/router";
import Image from "next/image";
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
  Grid,
  Stack,
  Chip,
  Snackbar,
  Grow,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { IconButtonProps } from "@mui/material/IconButton";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import { Post } from "../../types/Post";
import { PagePaths } from "enum/pages";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { AddParticipantToPost, RemoveParticipantFromPost } from "@/services/Participant";
import { Database } from "supabase/db_types";

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
}

export default function PostCard(props: props) {
  const router: NextRouter = useRouter();
  const supabaseClient = useSupabaseClient<Database>();

  const [isUserJoin, setIsUserJoin] = useState<boolean>(false)
  const [hiddenPostDetail, setHiddenPostDetail] = useState<boolean>(true);
  const [openSnackBar, setOpenSnackBar] = useState<snackBar>({ msg: "", isShow: false });
  const handleExpandDetail = (): void => setHiddenPostDetail(!hiddenPostDetail);

  function hasJoined(): boolean {
    if (!props.post.participants) return false
    for (let i = 0; i < props.post.participants.length; i++) {
      if (props.post.participants[i].userId === props.userId) {
        return true
      }
    }
    return false
  }

  useEffect(() => {
    if (hasJoined()) {
      setIsUserJoin(true)
    } else {
      setIsUserJoin(false)
    }
  }, [])

  function joinPost(): void {
    if (!props.userId) return;
    if (!isUserJoin) {
      AddParticipantToPost(props.userId, props.post.postId, supabaseClient)
        .then(() => {
          setOpenSnackBar({ msg: `Join ${props.post.title} !`, isShow: true })
          setIsUserJoin(true)
        }).catch((err) => {
          console.log(err)
          return;
        })
    } else {
      RemoveParticipantFromPost(props.userId, props.post.postId, supabaseClient)
        .then(() => {
          setOpenSnackBar({ msg: `Cancel ${props.post.title} !`, isShow: true })
          setIsUserJoin(false)
        }).catch((err) => {
          console.log(err)
          return;
        })
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
          titleTypographyProps={{ variant: "h5" }}
          subheaderTypographyProps={{ variant: "h6" }}
        />
        <CardContent
          style={{ padding: "0px 16px", marginLeft: 50, marginRight: 50 }}
        >
          {/* post preview details start here */}
          <Stack
            direction={!hiddenPostDetail ? "row" : "column"}
            spacing={2}
            marginBottom={2}
          >
            <Typography display="inline-flex">
              <LocationOnIcon fontSize="medium" />
              <span style={{ marginLeft: 8 }}>{props.post.location}</span>
            </Typography>
            <Typography display="inline-flex">
              <CalendarTodayIcon fontSize="medium" />
              <span style={{ marginLeft: 8 }}>
                {props.post.startDateTime} - {props.post.endDateTime}
              </span>
            </Typography>
          </Stack>
          <Grid container spacing={1}>
            {props.post.tags.map((e, index) => (
              <Grid item key={index}>
                <Chip
                  label={e}
                  variant="outlined"
                  style={{
                    minWidth: 100,
                    height: 40,
                    border: "1px solid gray",
                    fontSize: 18,
                  }}
                />
              </Grid>
            ))}
          </Grid>

          {/* post preview details end here */}
          <Collapse
            in={!hiddenPostDetail}
            sx={{ marginTop: 2, marginBottom: 1 }}
          >
            {/* post hidden details start here */}
            {props.post.description.split("\n").map((row) => (
              <Typography key={row}>{row}</Typography>
            ))}
            <Grid container spacing={2}>
              {props.post.image.map((e, index) => (
                <Grid item key={index}>
                  <Image src={e} alt="location" width={300} height={350} />
                </Grid>
              ))}
            </Grid>
            {/* post hidden details end here */}
          </Collapse>
        </CardContent>

        {/* Post Card Footer */}
        <CardActions style={{ padding: "4px 8px" }}>
          <Box sx={{ flexGrow: 1 }}></Box>

          <Grow in={!hiddenPostDetail} style={{ transformOrigin: "0 0 0" }}>
            <Button onClick={() => joinPost()} variant="contained">
              {!isUserJoin ? "Join" : "Cancel"}
            </Button>
          </Grow>

          <ExpandMore expand={!hiddenPostDetail} onClick={handleExpandDetail}>
            <ArrowDownwardIcon />
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
