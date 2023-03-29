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
  Stack,
} from "@mui/material";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { styled } from "@mui/material/styles";
import { IconButtonProps } from "@mui/material/IconButton";

import { Post } from "../../types/Post";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "supabase/db_types";
import { NextRouter, useRouter } from "next/router";
import { PAGE_PATHS } from "enum/PAGES";
import { DeletePost } from "@/services/Posts";
import CommonDialog from "../public/CommonDialog";
import { COLOR } from "enum/COLOR";
import dayjs from "dayjs";
import DisplayTags from "../post/DisplayTags";
import DisplayImages from "../post/DisplayImages";

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
          action={
            <>
              {owner && (
                <IconButton size="large" color="error" onClick={handleOpenDeletePostModal}>
                  <DeleteOutlineIcon fontSize="large" />
                </IconButton>
              )}
            </>
          }
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

          <ExpandMore expand={!hiddenPostDetail} onClick={handleExpandDetail}>
            <ArrowDownwardIcon fontSize="large" color="secondary" />
          </ExpandMore>
        </CardActions>
      </Card>

      {/* Comfirm Delete Dialog */}
      <CommonDialog
        openModal={openDeletePostModal}
        handleCloseModal={handleCloseDeletePostModal}
        header={["Are you sure to", "delete", "this post ?"]}
        content="*This action cannot be undone."
        buttonLabel="Delete"
        buttonColor={COLOR.ERROR}
        buttonAction={handleDelete}
      />
    </>
  );
}
