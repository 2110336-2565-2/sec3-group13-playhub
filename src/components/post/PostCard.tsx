import React from "react";
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

import EditIcon from "@mui/icons-material/Edit";
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

export default function PostCard(props: props) {
  const [openDeletePostModal, setOpenDeletePostModal] = React.useState<boolean>(false);
  const [hiddenPostDetail, setHiddenPostDetail] = React.useState<boolean>(true);
  const [openSnackBar, setOpenSnackBar] = React.useState<boolean>(false);

  const supabaseClient = useSupabaseClient<Database>();

  const handleOpenDeletePostModal = (): void => setOpenDeletePostModal(true);
  const handleCloseDeletePostModal = (): void => setOpenDeletePostModal(false);
  const handleExpandDetail = (): void => setHiddenPostDetail(!hiddenPostDetail);

  async function handleDelete() {
    const deletePostResult = await supabaseClient.rpc("delete_post_by_id", {
      target_id: props.post.post_id,
    });

    if (deletePostResult.error) {
      console.error(deletePostResult.error);
    } else {
      props.handleDeletePost(props.post);
    }

    handleCloseDeletePostModal();
  }

  function handleEditPost() {
    console.log("The post is edited");
    // edit post end-point
  }

  return (
    <>
      <Card
        sx={{
          border: "solid 4px",
          borderRadius: "16px",
        }}
      >
        {/* Post Card Header */}
        <CardHeader
          avatar={
            <Avatar
              sx={{ width: 50, height: 50 }}
              alt="Profile picture"
              src={props.post.ownerProfilePic}
            />
          }
          title={props.post.title}
          subheader={props.post.ownerName}
          titleTypographyProps={{ variant: "h5" }}
          subheaderTypographyProps={{ variant: "h6" }}
          action={
            <>
              {owner && (
                <>
                  <IconButton size="large" onClick={handleEditPost}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="large" color="error" onClick={handleOpenDeletePostModal}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </>
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
              <span style={{ marginLeft: 8 }}>{props.post.time}</span>
            </Typography>
          </Stack>
          <Grid container spacing={1}>
            {props.post.tags.map((e) => (
              <Grid item>
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
              {props.post.image.map((e) => (
                <Grid item>
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
            <Button onClick={() => setOpenSnackBar(true)} variant="contained">
              Join
            </Button>
          </Grow>

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
      <Snackbar
        open={openSnackBar}
        autoHideDuration={5000}
        message="ได้เวลาสนุกแล้วสิ"
        onClose={() => setOpenSnackBar(false)}
      />
    </>
  );
}
