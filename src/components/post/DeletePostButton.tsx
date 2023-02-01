import React from "react";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import DeletePostDialog from "./DeletePostDialog";
import IconButton from "@mui/material/IconButton";

export default function DeletePostButton() {
  const [openDeletePostModal, setOpenDeletePostModal] = React.useState(false);
  const handleOpenModal = () => setOpenDeletePostModal(true);
  const handleCloseModal = () => setOpenDeletePostModal(false);

  function deletePost() {
    console.log("The post is deleted");
    handleCloseModal();
    // call delete post endpoint
    // go to all post page
  }

  return (
    <>
      <IconButton color="error" onClick={handleOpenModal}>
        <DeleteOutlineIcon />
      </IconButton>
      <DeletePostDialog 
        openModal = {openDeletePostModal}
        handleCloseModal = {handleCloseModal}
        deletePost = {deletePost}
      />
      
    </>
  );
}
