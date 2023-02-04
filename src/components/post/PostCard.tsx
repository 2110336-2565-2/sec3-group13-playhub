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
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { styled } from "@mui/material/styles";
import { IconButtonProps } from "@mui/material/IconButton";
import DeletePostDialog from "@/components/post/DeletePostDialog";

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

// mock data
const tmpPost: any = {
  title: "ชวนไปดูแงว",
  ownerName: "น้องออม",
  ownerProfilePic: "/images/aom.jpg",
  // there are more data but omitted for now
};
const owner: boolean = true;

export default function PostCard() {
  const [hiddenPostDetail, setHiddenPostDetail] = React.useState(true);
  const [openDeletePostModal, setOpenDeletePostModal] = React.useState(false);

  const handleOpenModal = () => setOpenDeletePostModal(true);
  const handleCloseModal = () => setOpenDeletePostModal(false);
  const handleExpandDetail = () => setHiddenPostDetail(!hiddenPostDetail);

  function handleDeletePost() {
    console.log("The post is deleted");
    handleCloseModal();
    // delete post end-point
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
        <CardHeader
          avatar={<Avatar alt="Profile picture" src={tmpPost.ownerProfilePic} />}
          title={tmpPost.title}
          subheader={tmpPost.ownerName}
          action={
            <>
              {owner && (
                <>
                  <IconButton size="large" onClick={handleEditPost}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="large" color="error" onClick={handleOpenModal}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </>
              )}
            </>
          }
        />
        <CardContent>
          {/* post preview details start here */}
          <Typography>location</Typography>
          <Typography>time</Typography>
          {/* post preview details end here */}

          <Collapse in={!hiddenPostDetail}>
            {/* post hidden details start here */}
            <Typography>hihiihih</Typography>
            <Typography>hihiihih</Typography>
            <Typography>hihiihih</Typography>
            <Typography>hihiihih</Typography>
            <Typography>hihiihih</Typography>
            {/* post hidden details end here */}
          </Collapse>
        </CardContent>
        <CardActions>
          <Box sx={{ flexGrow: 1 }}></Box>

          <Grow in={!hiddenPostDetail} style={{ transformOrigin: "0 0 0" }}>
            <Button variant="contained">Join</Button>
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
    </>
  );
}
