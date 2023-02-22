import { useState } from "react";
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
  Grow,
  Button,
  IconButton,
  Grid,
  Stack,
  Chip,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { IconButtonProps } from "@mui/material/IconButton";

import EditIcon from "@mui/icons-material/Edit";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import DeletePostDialog from "@/components/post/DeletePostDialog";

import { Post } from "../../types/Post";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { PagePaths } from "enum/pages";
import { NextRouter, useRouter } from "next/router";
import { DeletePost } from "@/services/Posts";
const styles = {
  //boxSizing: "border-box",//padding: "0 0 20px 0",
  position: "static",
  background: "#FFFFFF",
  border: "5px solid #000000",
  boxShadow: "10px 10px 1px rgba(0, 0, 0, 0.25)",
  borderRadius: "30px",
  width: "60%",
  height: "280px",
};
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

const owner: boolean = true;

type props = {
  post: Post;
  //handleDeletePost: (toDeletePost: Post) => void;
  isLeft: Boolean;
};
export default function EachPostCard(props: props) {
  const router: NextRouter = useRouter();

  const [openDeletePostModal, setOpenDeletePostModal] = useState<boolean>(false);
  const [hiddenPostDetail, setHiddenPostDetail] = useState<boolean>(true);
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);

  const supabaseClient = useSupabaseClient<Database>();

  const handleOpenDeletePostModal = (): void => setOpenDeletePostModal(true);
  const handleCloseDeletePostModal = (): void => setOpenDeletePostModal(false);
  const handleExpandDetail = (): void => setHiddenPostDetail(!hiddenPostDetail);

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
          titleTypographyProps={{ variant: "h5" }}
          subheaderTypographyProps={{ variant: "h6" }}
          //action={}
        />
        <CardContent style={{ padding: "0px 16px", marginLeft: 50, marginRight: 50 }}>
          {/* post preview details start here */}
          <Stack direction={!hiddenPostDetail ? "row" : "column"} spacing={2} marginBottom={2}>
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
                    border: "3px solid rgba(0, 0, 0, 0.12)",
                    fontSize: 18,
                    borderRadius: "4px",
                    color: "#FFA31A",
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}
