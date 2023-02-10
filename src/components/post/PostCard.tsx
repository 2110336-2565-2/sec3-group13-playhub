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

export default function PostCard(props: Post) {
  const [hiddenPostDetail, setHiddenPostDetail] = React.useState(true);
  const [openDeletePostModal, setOpenDeletePostModal] = React.useState(false);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);

  const supabaseClient = useSupabaseClient<Database>();

  const handleOpenModal = () => setOpenDeletePostModal(true);
  const handleCloseModal = () => setOpenDeletePostModal(false);
  const handleExpandDetail = () => setHiddenPostDetail(!hiddenPostDetail);

  async function handleDeletePost() {
    handleCloseModal();
    const deletePostResult = await supabaseClient.rpc('delete_post_by_id', {target_id:props.post_id})

    if (deletePostResult.error != null) {
      console.error(deletePostResult.error);
    }

    if(deletePostResult.error == null) return;
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
          minWidth: "260px",
          maxWidth: "1200px",
          margin: "40px",
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              sx={{ width: 50, height: 50 }}
              alt="Profile picture"
              src={props.ownerProfilePic}
            />
          }
          title={props.title}
          subheader={props.ownerName}
          titleTypographyProps={{ variant: "h5" }}
          subheaderTypographyProps={{ variant: "h6" }}
          action={
            <>
              {owner && (
                <>
                  <IconButton size="large" onClick={handleEditPost}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="large"
                    color="error"
                    onClick={handleOpenModal}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </>
              )}
            </>
          }
        />
        <CardContent style={{ padding: "0px 16px", marginLeft: 50 }}>
          {/* post preview details start here */}
          <Stack
            direction={!hiddenPostDetail ? "row" : "column"}
            spacing={2}
            marginBottom={2}
          >
            <Typography display="inline-flex">
              <LocationOnIcon fontSize="medium" />
              <span style={{ marginLeft: 8 }}>{props.location}</span>
            </Typography>
            <Typography display="inline-flex">
              <CalendarTodayIcon fontSize="medium" />
              <span style={{ marginLeft: 8 }}>{props.time}</span>
            </Typography>
          </Stack>
          <Grid container spacing={1}>
            {props.tags.map((e) => (
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
          <Collapse in={!hiddenPostDetail} sx={{ marginTop: 2 }}>
            {/* post hidden details start here */}
            {props.description.split("\n").map((row) => (
              <Typography key={row}>{row}</Typography>
            ))}
            <Grid container spacing={2}>
              {props.image.map((e) => (
                <Grid item>
                  <Image src={e} alt="location" width={300} height={350} />
                </Grid>
              ))}
            </Grid>
            {/* post hidden details end here */}
          </Collapse>
        </CardContent>
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

      <DeletePostDialog
        openModal={openDeletePostModal}
        handleCloseModal={handleCloseModal}
        deletePost={handleDeletePost}
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
