import { useState } from "react";
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
} from "@mui/material";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import { IconButtonProps } from "@mui/material/IconButton";
import DeletePostDialog from "@/components/post/DeletePostDialog";

import { Post } from "../../types/Post";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { NextRouter, useRouter } from "next/router";
import { PAGE_PATHS } from "enum/PAGES";
import { DeletePost } from "@/services/Posts";

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
  handleDeletePost: (toDeletePost: Post) => void;
};

export default function AdminPostCard(props: props) {
  const router: NextRouter = useRouter();

  const [openDeletePostModal, setOpenDeletePostModal] = useState<boolean>(false);
  const [hiddenPostDetail, setHiddenPostDetail] = useState<boolean>(true);

  const supabaseClient = useSupabaseClient<Database>();

  const handleOpenDeletePostModal = (): void => setOpenDeletePostModal(true);
  const handleCloseDeletePostModal = (): void => setOpenDeletePostModal(false);
  const handleExpandDetail = (): void => setHiddenPostDetail(!hiddenPostDetail);

  async function handleDelete() {
    DeletePost(props.post.postId, supabaseClient)
      .then(() => {
        props.handleDeletePost(props.post);
        handleCloseDeletePostModal();
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  }

  return (
    <>
      <Card
        sx={{
          border: "solid 4px",
          borderRadius: "16px",
          minWidth: "260px",
          maxWidth: "1200px",
          margin: "40px",
        }}
      >
        {/* Post Card Header */}
        <CardHeader
          avatar={
            <IconButton
              onClick={() => {
                router.push(PAGE_PATHS.MY_PROFILE + props.post.ownerId);
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
          action={
            <>
              {owner && (
                <IconButton size="large" color="error" onClick={handleOpenDeletePostModal}>
                  <DeleteOutlineIcon />
                </IconButton>
              )}
            </>
          }
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
                    border: "1px solid gray",
                    fontSize: 18,
                  }}
                />
              </Grid>
            ))}
          </Grid>

          {/* post preview details end here */}
          <Collapse in={!hiddenPostDetail} sx={{ marginTop: 2, marginBottom: 1 }}>
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

          <ExpandMore expand={!hiddenPostDetail} onClick={handleExpandDetail}>
            <ArrowDownwardIcon />
          </ExpandMore>
        </CardActions>
      </Card>

      {/* Comfirm Delete Dialog */}
      <DeletePostDialog
        openModal={openDeletePostModal}
        handleCloseModal={handleCloseDeletePostModal}
        deletePost={handleDelete}
      />
    </>
  );
}
